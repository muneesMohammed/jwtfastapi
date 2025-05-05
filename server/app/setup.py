from sqlalchemy.orm import Session
from app.core.config import settings
from app.crud.user import create_user, get_user_by_email
from app.crud.role import get_role_by_name, create_role
from app.schemas.user import UserCreate
from app.schemas.role import RoleCreate


def seed_roles(db):
    default_roles = ["admin", "user", "foreman"]

    for role_name in default_roles:
        if not get_role_by_name(db, role_name):
            role_data = RoleCreate(name=role_name)
            create_role(db, role_data)


def setup_first_admin(db: Session):
    """Creates the first admin user if none exists"""
    admin = get_user_by_email(db, settings.FIRST_SUPERUSER_EMAIL)
    if admin:
        return {"message": "Admin user already exists"}

    role = get_role_by_name(db, "admin")
    if not role:
        raise Exception("Admin role not found in the database. Please seed roles first.")

    admin_data = UserCreate(
        email=settings.FIRST_SUPERUSER_EMAIL,
        password=settings.FIRST_SUPERUSER_PASSWORD,
        full_name="Admin User",
        role_id=role.id,
        is_active=True,
        is_verified=True
    )
    create_user(db, admin_data)
    return {"message": "Admin user created successfully"}
