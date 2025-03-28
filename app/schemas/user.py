from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from app.models.user import Role

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = Field(None, min_length=2, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=50)
    role: Role = Role.USER

class UserRegister(UserBase):
    password: str = Field(..., min_length=8, max_length=50)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, min_length=2, max_length=50)
    password: Optional[str] = Field(None, min_length=8, max_length=50)
    is_active: Optional[bool] = None
    role: Optional[Role] = None

class UserInDB(UserBase):
    id: int
    is_active: bool
    role: Role
    is_verified: bool

    class Config:
        from_attributes = True