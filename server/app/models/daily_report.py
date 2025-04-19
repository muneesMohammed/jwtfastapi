from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base


class DailyReport(Base):
    __tablename__ = "daily_reports"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="daily_reports")
    project = relationship("Project", back_populates="reports")
    manpower = relationship("ManpowerUtilized", back_populates="report", cascade="all, delete-orphan")
    machinery = relationship("MachineryUtilized", back_populates="report", cascade="all, delete-orphan")
    activities = relationship("ActivitiesCarriedOut", back_populates="report", cascade="all, delete-orphan")


  

class ManpowerUtilized(Base):
    __tablename__ = "manpower_utilized"
    id = Column(Integer, primary_key=True)
    report_id = Column(Integer, ForeignKey("daily_reports.id"))
    worker_id = Column(String(255))
    name = Column(String(255))
    category = Column(String(255))
    total_hours = Column(Float)
    skilled = Column(Boolean)

    report = relationship("DailyReport", back_populates="manpower")


class MachineryUtilized(Base):
    __tablename__ = "machinery_utilized"
    id = Column(Integer, primary_key=True)
    report_id = Column(Integer, ForeignKey("daily_reports.id"))
    machinery_name = Column(String(255))
    hours_used = Column(Float)

    report = relationship("DailyReport", back_populates="machinery")


class ActivitiesCarriedOut(Base):
    __tablename__ = "activities_carried_out"
    id = Column(Integer, primary_key=True)
    report_id = Column(Integer, ForeignKey("daily_reports.id"))
    activity_name = Column(String(255))
    unit = Column(String(255))

    report = relationship("DailyReport", back_populates="activities")
