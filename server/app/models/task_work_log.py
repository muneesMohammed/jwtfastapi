# models/task_work_log.py

from sqlalchemy import Column, Integer, ForeignKey, Date, Float
from sqlalchemy.orm import relationship
from database import Base

class TaskWorkLog(Base):
    __tablename__ = "task_work_logs"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    employee_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)
    hours = Column(Float)

    task = relationship("Task", back_populates="work_logs")
    employee = relationship("User", back_populates="work_logs")
