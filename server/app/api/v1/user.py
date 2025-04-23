from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from typing import List
import logging
from app.api.dependencies import (
    get_current_active_admin, 
    get_current_active_manager, 
    get_current_active_user
)
from app.crud.user import get_user, get_users, create_user, update_user, delete_user, get_user_by_email
from app.db.session import get_db
from app.schemas.user import UserCreate, UserInDB, UserUpdate
from app.core.config import logger
from app.models.user import Role

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/", response_model=List[UserInDB])
async def read_users(
    request: Request,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
):
    """Get list of users (admin only)"""
    logger.info(f"User list requested by {current_user.email}")
    try:
        users = get_users(db, skip=skip, limit=limit)
        logger.debug(f"Returning {len(users)} users")
        return users
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/", response_model=UserInDB, status_code=status.HTTP_201_CREATED)
async def create_new_user(
    request: Request,
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
):
    """Create a new user (admin only)"""
    logger.info(f"User creation requested by admin {current_user.email}")
    
    try:
        existing_user = get_user_by_email(db, user.email)
        if existing_user:
            logger.warning(f"User creation failed - email exists: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        user_data = user.model_dump()
        created_user = create_user(db, user_data)
        
        logger.info(f"User created by admin: {created_user.email} with role {created_user.role}")
        return created_user
    except Exception as e:
        logger.error(f"Admin user creation failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/me", response_model=UserInDB)
async def read_user_me(
    request: Request,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Get current user profile"""
    logger.debug(f"User profile requested by {current_user.email}")
    return current_user

@router.get("/{user_id}", response_model=UserInDB)
async def read_user(
    request: Request,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_manager)
):
    """Get user details by ID (manager or admin only)"""
    logger.info(f"User details requested for ID {user_id} by {current_user.email}")
    try:
        user = get_user(db, user_id=user_id)
        if user is None:
            logger.warning(f"User not found with ID: {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    except Exception as e:
        logger.error(f"Error fetching user: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.put("/{user_id}", response_model=UserInDB)
async def update_user_details(
    request: Request,
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_manager)
):
    """Update user details (manager or admin only)"""
    logger.info(f"User update requested for ID {user_id} by {current_user.email}")
    try:
        user = get_user(db, user_id=user_id)
        if user is None:
            logger.warning(f"User not found with ID: {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Prevent non-admins from promoting users to higher roles
        if (current_user.role != Role.ADMIN and 
            user_in.role is not None and 
            user_in.role != user.role):
            logger.warning(
                f"Unauthorized role change attempt by {current_user.email} "
                f"from {user.role} to {user_in.role}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can change user roles"
            )
        
        updated_user = update_user(db, user_id=user_id, user_update=user_in)
        logger.info(f"User updated successfully: {updated_user.email}")
        return updated_user
    except Exception as e:
        logger.error(f"User update failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_account(
    request: Request,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
):
    """Delete user account (admin only)"""
    logger.info(f"User deletion requested for ID {user_id} by {current_user.email}")
    try:
        user = get_user(db, user_id=user_id)
        if user is None:
            logger.warning(f"User not found with ID: {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        delete_user(db, user_id=user_id)
        logger.info(f"User deleted successfully: ID {user_id}")
    except Exception as e:
        logger.error(f"User deletion failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )