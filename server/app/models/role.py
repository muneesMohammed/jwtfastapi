 
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    permissions = Column(String(100), nullable=True)

    # Relationships
    users = relationship("User", back_populates="role")
    employees = relationship("Employee", back_populates="role")