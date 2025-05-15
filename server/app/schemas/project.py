# app/schemas/project.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: Optional[date] = None  # Changed from str to date
    end_date: Optional[date] = None    # Same here
    location: Optional[str] = None
    status: Optional[str] = "planning"
    foreman_id: Optional[int] = None
    engineer_id: Optional[int] = None
    project_manager_id: Optional[int] = None

class ProjectCreate(ProjectBase):
    name: str  # Required field

class ProjectUpdate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True
        json_encoders = {
            date: lambda v: v.strftime('%Y-%m-%d')
        }