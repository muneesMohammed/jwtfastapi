from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class ManpowerUtilizedCreate(BaseModel):
    worker_id: str
    name: str
    category: str
    total_hours: float
    skilled: bool

class MachineryUtilizedCreate(BaseModel):
    machinery_name: str
    hours_used: float
    remarks: Optional[str] = None  



class ActivitiesCarriedOutCreate(BaseModel):
    activity_name: str
    unit: Optional[str] = None
    quantity: Optional[str] = None   
    remarks: Optional[str] = None

class DailyReportCreate(BaseModel):
    date: date
    project_id: int
    manpower: List[ManpowerUtilizedCreate]
    machinery: List[MachineryUtilizedCreate]
    activities: List[ActivitiesCarriedOutCreate]
    remarks: Optional[str] = None

class DailyReportResponse(BaseModel):
    id: int
    project_id: int
    date: date
    remarks: Optional[str] = None

    class Config:
        orm_mode = True



class DailyReportListOut(BaseModel):
    id: int
    date: date
    project_id: int

    class Config:
        orm_mode = True
