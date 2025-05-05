from pydantic import BaseModel
from typing import Optional


class RoleBase(BaseModel):
    name: str
    permissions: Optional[str] = None


class RoleCreate(RoleBase):
    pass


class RoleUpdate(BaseModel):
    name: Optional[str] = None
    permissions: Optional[str] = None

    class Config:
        from_attributes = True


class RoleInDB(RoleBase):
    id: int

    class Config:
        from_attributes = True
