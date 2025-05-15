 
from sqlalchemy.orm import Session
from app.models.role import Role
from app.schemas.role import RoleCreate, RoleUpdate
from typing import Optional, List


def get_role(db: Session, role_id: int) -> Optional[Role]:
    return db.query(Role).filter(Role.id == role_id).first()

def get_role_by_name(db: Session, name: str) -> Optional[Role]:
    return db.query(Role).filter(Role.name == name).first()

def get_roles(db: Session, skip: int = 0, limit: int = 100) -> List[Role]:
    return db.query(Role).offset(skip).limit(limit).all()

def create_role(db: Session, role: RoleCreate) -> Role:
    try:
        db_role = Role(**role.model_dump())
        db.add(db_role)
        db.commit()
        db.refresh(db_role)
        return db_role
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create role")

def update_role(db: Session, role_id: int, role_update: RoleUpdate) -> Optional[Role]:
    db_role = get_role(db=db, role_id=role_id)
    if not db_role:
        return None

    try:
        update_data = role_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_role, key, value)

        db.commit()
        db.refresh(db_role)
        return db_role
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update role")

def delete_role(db: Session, role_id: int) -> Optional[Role]:
    db_role = get_role(db=db, role_id=role_id)
    if not db_role:
        return None

    try:
        db.delete(db_role)
        db.commit()
        return db_role
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete role")