from sqlalchemy.orm import Session
from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash
from app.core.config import logger

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user_data: UserCreate):
    try:
        hashed_password = get_password_hash(user_data.password)

        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            is_active=user_data.is_active if user_data.is_active is not None else True,
            role_id=user_data.role_id,
            is_verified=user_data.is_verified if user_data.is_verified is not None else False
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.debug(f"User created: {db_user.email}")
        return db_user
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating user: {str(e)}")
        raise

def update_user(db: Session, user_id: int, user_update: UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.model_dump(exclude_unset=True)
    
    if "password" in update_data:
        hashed_password = get_password_hash(update_data["password"])
        del update_data["password"]
        update_data["hashed_password"] = hashed_password
    
    try:
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        db.commit()
        db.refresh(db_user)
        logger.debug(f"User updated: {db_user.email}")
        return db_user
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating user: {str(e)}")
        raise

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    try:
        db.delete(db_user)
        db.commit()
        logger.debug(f"User deleted: ID {user_id}")
        return db_user
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting user: {str(e)}")
        raise
