from datetime import timedelta
import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings, logger
from app.crud.user import get_user_by_email, create_user
from app.db.session import get_db
from app.schemas.token import Token
from app.schemas.user import UserInDB, UserRegister
from app.models.user import Role



router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# Your login and register routes here...


@router.post("/login", response_model=Token)
def login(
    request: Request,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    logger.info(f"Login attempt for user: {form_data.username}")
    
    try:
        user = get_user_by_email(db, form_data.username)
        if not user:
            logger.warning(f"Login failed - user not found: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password2222222",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not security.verify_password(form_data.password, user.hashed_password):
            logger.warning(f"Login failed - invalid password for user: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password3333",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.is_active:
            logger.warning(f"Login failed - inactive user: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Inactive user",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = security.create_access_token(
            data={"sub": user.email, "role": user.role},
            expires_delta=access_token_expires
        )
        
        logger.info(f"User logged in successfully: {user.email}")
        return {"access_token": access_token, "token_type": "bearer"}
    
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        raise

@router.post("/register", response_model=UserInDB)
def register(
    request: Request,
    user_in: UserRegister,
    db: Session = Depends(get_db)
):
    logger.info(f"Registration attempt for email: {user_in.email}")
    
    try:
        existing_user = get_user_by_email(db, user_in.email)
        if existing_user:
            logger.warning(f"Registration failed - user already exists: {user_in.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The user with this email already exists."
            )
        
        user_data = {
            "email": user_in.email,
            "full_name": user_in.full_name,
            "password": user_in.password,
            "role": Role.USER,
            "is_active": True
        }
        
        created_user = create_user(db, user_data)
        logger.info(f"User registered successfully: {created_user.email}")
        return created_user
    
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )