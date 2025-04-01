from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.crud.user import create_user, get_user_by_email
from app.db.session import get_db
from app.models.user import Role
from app.schemas.user import UserCreate

def setup_first_admin(db: Session = Depends(get_db)):
    """Creates the first admin user if none exists"""
    admin = get_user_by_email(db, settings.FIRST_SUPERUSER_EMAIL)
    if admin:
        return {"message": "Admin user already exists"}
    
    admin_data = {
        "email": settings.FIRST_SUPERUSER_EMAIL,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
        "role": Role.ADMIN,
        "is_active": True,
        "is_verified": True
    }
    create_user(db, admin_data)
    return {"message": "Admin user created successfully"}