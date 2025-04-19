# schemas/task_work_log.py
from pydantic import BaseModel
from datetime import date

class TaskWorkLogCreate(BaseModel):
    task_id: int
    employee_id: int
    date: date
    hours: float
