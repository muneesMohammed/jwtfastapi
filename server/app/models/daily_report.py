from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Boolean, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from app.db.base import Base


from sqlalchemy.sql import func

class DailyReport(Base):
    __tablename__ = "daily_reports"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    remarks = Column(String(255), nullable=True)

    # New columns for created_at and modified_at
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    modified_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="daily_reports")
    project = relationship("Project", back_populates="reports")

        # Foreign key to Employee
    employee_id = Column(Integer, ForeignKey("employees.id"))

    # Relationship back to Employee
    employee = relationship("Employee", back_populates="daily_reports")

    manpower = relationship("ManpowerUtilized", back_populates="report", cascade="all, delete-orphan")
    machinery = relationship("MachineryUtilized", back_populates="report", cascade="all, delete-orphan")
    activities = relationship("ActivitiesCarriedOut", back_populates="report", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<DailyReport id={self.id} project_id={self.project_id} date={self.date}>"
class ManpowerUtilized(Base):
    __tablename__ = "manpower_utilized"

    id = Column(Integer, primary_key=True)
    report_id = Column(Integer, ForeignKey("daily_reports.id"), index=True)
    worker_id = Column(String(255))
    name = Column(String(255))
    category = Column(String(255))
    total_hours = Column(Float)
    skilled = Column(Boolean)

    report = relationship("DailyReport", back_populates="manpower")

    def __repr__(self):
        return f"<ManpowerUtilized id={self.id} worker={self.name} hours={self.total_hours}>"



class MachineryUtilized(Base):
    __tablename__ = "machinery_utilized"

    id = Column(Integer, primary_key=True)
    report_id = Column(Integer, ForeignKey("daily_reports.id"), index=True)
    machinery_name = Column(String(255))
    hours_used = Column(Float)
    remarks= Column(String(255))

    report = relationship("DailyReport", back_populates="machinery")

    def __repr__(self):
        return f"<MachineryUtilized id={self.id} name={self.machinery_name} hours={self.hours_used}>"


class ActivitiesCarriedOut(Base):
    __tablename__ = "activities_carried_out"

    id = Column(Integer, primary_key=True)
    report_id = Column(Integer, ForeignKey("daily_reports.id"), index=True)
    activity_name = Column(String(255))
    unit = Column(String(255))
    quantity= Column(String(255))
    remarks = Column(String(255))
    report = relationship("DailyReport", back_populates="activities")

    def __repr__(self):
        return f"<ActivitiesCarriedOut id={self.id} name={self.activity_name} unit={self.unit}>"
