from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship

from app.db.base import Base






class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(String(1000), nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    location = Column(String(255), nullable=True)
    status = Column(String(50), default="planning")  # e.g., planning, active, completed, on-hold

    # Foreign keys to Employee table
    foreman_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    engineer_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    project_manager_id = Column(Integer, ForeignKey("employees.id"), nullable=True)

    # Relationships
    foreman = relationship("Employee", foreign_keys=[foreman_id])
    engineer = relationship("Employee", foreign_keys=[engineer_id])
    project_manager = relationship("Employee", foreign_keys=[project_manager_id])

    # Back-populated relationships
    reports = relationship("DailyReport", back_populates="project")
    # tasks = relationship("Task", back_populates="project")

    def __repr__(self):
        return f"<Project(id={self.id}, name='{self.name}', status='{self.status}')>"