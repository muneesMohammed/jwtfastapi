 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.user import UserInDB, UserCreate, UserUpdate, UserWithRole
from app.crud.user import get_users, get_user, create_user, update_user, delete_user
from app.auth.dependencies import get_current_active_user, role_required
import logging

router = APIRouter(prefix="/users", tags=["Users"])
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[UserWithRole])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(role_required("admin"))
):
    users = get_users(db, skip=skip, limit=limit)
    return users

@router.post("/", response_model=UserInDB)
def create_new_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(role_required("admin"))
):
    return create_user(db=db, user=user)

@router.get("/{user_id}", response_model=UserWithRole)
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    db_user = get_user(db, user_id=user_id)
    if db_user is None:
        logger.error(f"User not found with id: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}", response_model=UserInDB)
def update_existing_user(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    db_user = get_user(db, user_id=user_id)
    if db_user is None:
        logger.error(f"User not found with id: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    
    # Only admin or the same user can update
    if current_user.role.name != "admin" and current_user.id != user_id:
        logger.error(f"Unauthorized update attempt by user: {current_user.email}")
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return update_user(db=db, user_id=user_id, user_update=user)

@router.delete("/{user_id}")
def delete_existing_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(role_required("admin"))
):
    db_user = get_user(db, user_id=user_id)
    if db_user is None:
        logger.error(f"User not found with id: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    return delete_user(db=db, user_id=user_id)