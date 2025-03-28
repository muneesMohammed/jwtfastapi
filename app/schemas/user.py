 
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    role_id: Optional[int] = None

class UserInDB(UserBase):
    id: int
    is_active: bool
    role_id: Optional[int]
    
    class Config:
        orm_mode = True

class UserWithRole(UserInDB):
    role_name: Optional[str]
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str