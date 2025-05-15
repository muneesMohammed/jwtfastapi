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




class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    due_date = Column(Date, nullable=True)
    status = Column(String(50), default="pending")  # pending, in_progress, completed

    project_id = Column(Integer, ForeignKey("projects.id"))
    assigned_to_id = Column(Integer, ForeignKey("employees.id"))

    project = relationship("Project", back_populates="tasks")
    assigned_to = relationship("Employee", back_populates="tasks")