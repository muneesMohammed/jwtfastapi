from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session
import logging
from app.core import security
from app.core.config import settings, logger
from app.crud.user import get_user_by_email
from app.db.session import get_db
from app.schemas.token import TokenPayload
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

def log_request(request: Request):
    logger.info(f"Incoming request: {request.method} {request.url}")
    logger.debug(f"Headers: {dict(request.headers)}")
    # Note: Removed async body parsing to simplify
    # For body logging, you'd need to make this async and handle properly

def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    log_request(request)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        logger.debug(f"Authenticating user with token: {token[:10]}...")
        payload = security.decode_token(token)
        if payload is None:
            logger.warning("Token decoding returned None")
            raise credentials_exception
        token_data = TokenPayload(**payload)
        logger.debug(f"Token data: {token_data}")
    except JWTError as e:
        logger.error(f"JWT Error: {str(e)}")
        raise credentials_exception
    
    user = get_user_by_email(db, email=token_data.sub)
    if user is None:
        logger.warning(f"User not found with email: {token_data.sub}")
        raise credentials_exception
    
    logger.info(f"User authenticated: {user.email}")
    return user

def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        logger.warning(f"Inactive user attempt: {current_user.email}")
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# def get_current_active_admin(current_user: User = Depends(get_current_active_user)):
#     if current_user.role != "admin":
#         logger.warning(f"Unauthorized admin access attempt by: {current_user.email}")
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="The user doesn't have enough privileges"
#         )
#     logger.debug(f"Admin access granted to: {current_user.email}")
#     return current_user

# def get_current_active_manager(current_user: User = Depends(get_current_active_user)):
#     if current_user.role not in ["admin", "manager"]:
#         logger.warning(f"Unauthorized manager access attempt by: {current_user.email}")
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="The user doesn't have enough privileges"
#         )
#     logger.debug(f"Manager access granted to: {current_user.email}")
#     return current_user

def get_current_active_admin(current_user: User = Depends(get_current_active_user)):
    if not hasattr(current_user, "role") or current_user.role.name.lower() != "admin":
        logger.warning(f"Unauthorized admin access attempt by: {current_user.email}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    logger.debug(f"Admin access granted to: {current_user.email}")
    return current_user


def get_current_active_manager(current_user: User = Depends(get_current_active_user)):
    if not hasattr(current_user, "role") or current_user.role.name.lower() not in ["admin", "manager"]:
        logger.warning(f"Unauthorized manager access attempt by: {current_user.email}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    logger.debug(f"Manager access granted to: {current_user.email}")
    return current_user
