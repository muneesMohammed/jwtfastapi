from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Union


# String ref to Role models
RoleInDB = "app.schemas.role.RoleShort"


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = Field(None, min_length=2, max_length=50)

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=50)
    role_id: int
    is_active: bool = True
    is_verified: bool = True


class UserRegister(UserBase):
    password: str = Field(..., min_length=8, max_length=50)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, min_length=2, max_length=50)
    password: Optional[str] = Field(None, min_length=8, max_length=50)
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    role_id: Optional[int] = None

    class Config:
        from_attributes = True


class RoleShort(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class UserInDB(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    role: Union[str, 'RoleShort']  # Can be just name or object

    class Config:
        from_attributes = True


# Resolve forward refs
UserInDB.model_rebuild()