from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.auth.utils import decode_token
from app.config import settings
from app.crud.user import get_user
from app.database import get_db
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = decode_token(token)
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except Exception as e:
        logger.error(f"Error decoding token: {str(e)}")
        raise credentials_exception
    
    user = get_user(db, user_id=user_id)
    if user is None:
        logger.error(f"User not found with id: {user_id}")
        raise credentials_exception
    
    return user

def get_current_active_user(current_user: dict = Depends(get_current_user)):
    if not current_user.is_active:
        logger.error(f"Inactive user: {current_user.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

def role_required(role_name: str):
    def role_checker(current_user: dict = Depends(get_current_active_user)):
        if not current_user.role or current_user.role.name != role_name:
            logger.error(f"User {current_user.email} doesn't have required role: {role_name}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return current_user
    return role_checker

def permission_required(permission: str):
    def permission_checker(current_user: dict = Depends(get_current_active_user)):
        if not current_user.role or permission not in current_user.role.permissions.split(','):
            logger.error(f"User {current_user.email} doesn't have required permission: {permission}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return current_user
    return permission_checker 
