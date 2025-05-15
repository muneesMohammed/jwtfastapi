from pydantic import BaseModel
from typing import Optional
from datetime import date
from typing_extensions import Annotated
from pydantic import model_validator


# Use string reference to avoid circular dependency
RoleShort = "app.schemas.role.RoleShort"


class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    hire_date: Optional[date] = None
    salary: Optional[int] = None
    role_id: int

    class Config:
        from_attributes = True

    @model_validator(mode="after")
    def convert_hire_date_to_string(self):
        if isinstance(self.hire_date, date):
            self.hire_date = self.hire_date.strftime("%Y-%m-%d")
        return self


class EmployeeCreate(EmployeeBase):
    first_name: str
    last_name: str
    role_id: int


class EmployeeUpdate(EmployeeBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    hire_date: Optional[str] = None
    salary: Optional[int] = None
    role_id: Optional[int] = None


# Short version used in RoleResponse
class RoleShort(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class EmployeeResponse(EmployeeBase):
    id: int
    role: Annotated[Optional['RoleShort'], None]

    class Config:
        from_attributes = True


# Resolve forward references
EmployeeResponse.model_rebuild()