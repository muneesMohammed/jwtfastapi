from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.models.role import Role
from app.db.base import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    phone = Column(String(20), nullable=True)
    hire_date = Column(Date, nullable=True)
    salary = Column(Integer, nullable=True)

    # Foreign Key to Role Table
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)

    # Relationship
    role = relationship("Role", back_populates="employees")

    # Other relationships
    projects_foreman = relationship("Project", foreign_keys="[Project.foreman_id]", back_populates="foreman")
    projects_engineer = relationship("Project", foreign_keys="[Project.engineer_id]", back_populates="engineer")
    projects_manager = relationship("Project", foreign_keys="[Project.project_manager_id]", back_populates="project_manager")

    daily_reports = relationship("DailyReport", back_populates="employee")

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __repr__(self):
        return f"<Employee(id={self.id}, name='{self.full_name}', role='{self.role.name}')>"