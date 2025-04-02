 
# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordRequestForm
# from sqlalchemy.orm import Session
# from datetime import timedelta
# from app.database import get_db
# from app.schemas.user import UserLogin, UserCreate, UserInDB
# from app.crud.user import get_user_by_email, create_user
# from app.auth.utils import verify_password, create_access_token, get_password_hash
# from app.config import settings
# from app.auth.dependencies import get_current_user
# import logging

# router = APIRouter(tags=["Authentication"])
# logger = logging.getLogger(__name__)

# @router.post("/register", response_model=UserInDB)
# def register(user: UserCreate, db: Session = Depends(get_db)):
#     db_user = get_user_by_email(db, email=user.email)
#     if db_user:
#         logger.error(f"User registration failed - email already registered: {user.email}")
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Email already registered"
#         )
#     return create_user(db=db, user=user)

# @router.post("/login")
# def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = get_user_by_email(db, email=form_data.username)
#     if not user or not verify_password(form_data.password, user.hashed_password):
#         logger.error(f"Login failed for user: {form_data.username}")
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password444",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    
#     if not user.is_active:
#         logger.error(f"Login failed - inactive user: {user.email}")
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Inactive user"
#         )
    
#     access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         data={"sub": str(user.id)}, expires_delta=access_token_expires
#     )
    
#     logger.info(f"User logged in successfully: {user.email}")
#     return {
#         "access_token": access_token,
#         "token_type": "bearer",
#         "user_id": user.id,
#         "email": user.email,
#         "role": user.role.name if user.role else None
#     }

# @router.get("/me", response_model=UserInDB)
# def read_users_me(current_user: UserInDB = Depends(get_current_user)):
#     return current_user