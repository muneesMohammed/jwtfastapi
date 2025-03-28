 
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False)
    permissions = Column(String(255))  # Comma-separated permissions
    
    users = relationship("User", back_populates="role")
    
    def __repr__(self):
        return f"<Role {self.name}>"