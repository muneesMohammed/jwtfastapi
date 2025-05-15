from pydantic import BaseModel
from typing import List, Optional
from typing_extensions import Annotated


# Use string references to prevent circular dependencies
EmployeeShort = "app.schemas.employee.EmployeeShort"
UserShort = "app.schemas.user.UserShort"


class RoleBase(BaseModel):
    name: str
    permissions: Optional[str] = None

    class Config:
        from_attributes = True


class RoleCreate(RoleBase):
    name: str


class RoleUpdate(RoleBase):
    name: Optional[str] = None
    permissions: Optional[str] = None


class EmployeeShort(BaseModel):
    id: int
    first_name: str
    last_name: str

    class Config:
        from_attributes = True


class UserShort(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None

    class Config:
        from_attributes = True


class RoleResponse(RoleBase):
    id: int
    employees: List[Annotated[Optional[EmployeeShort], None]] = []
    users: List[Annotated[Optional[UserShort], None]] = []

    class Config:
        from_attributes = True


# Resolve forward references
RoleResponse.model_rebuild()