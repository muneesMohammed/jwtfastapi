from sqlalchemy import Boolean, Column, Integer, String, Enum
from app.db.base import Base
from enum import Enum as PyEnum

class Role(str, PyEnum):
    ADMIN = "admin"
    MANAGER = "manager"
    USER = "user"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    role = Column(Enum(Role), default=Role.USER)
    is_verified = Column(Boolean, default=False)