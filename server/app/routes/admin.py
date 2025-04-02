 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.role import RoleInDB, RoleCreate, RoleUpdate
from app.crud.role import get_roles, get_role, create_role, update_role, delete_role
from app.auth.dependencies import get_current_active_user, role_required
import logging

router = APIRouter(prefix="/admin", tags=["Admin"])
logger = logging.getLogger(__name__)

@router.get("/roles/", response_model=List[RoleInDB])
def read_roles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required("admin"))
):
    roles = get_roles(db, skip=skip, limit=limit)
    return roles

@router.post("/roles/", response_model=RoleInDB)
def create_new_role(
    role: RoleCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required("admin"))
):
    return create_role(db=db, role=role)

@router.put("/roles/{role_id}", response_model=RoleInDB)
def update_existing_role(
    role_id: int,
    role: RoleUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required("admin"))
):
    db_role = get_role(db, role_id=role_id)
    if db_role is None:
        logger.error(f"Role not found with id: {role_id}")
        raise HTTPException(status_code=404, detail="Role not found")
    return update_role(db=db, role_id=role_id, role_update=role)

@router.delete("/roles/{role_id}")
def delete_existing_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required("admin"))
):
    db_role = get_role(db, role_id=role_id)
    if db_role is None:
        logger.error(f"Role not found with id: {role_id}")
        raise HTTPException(status_code=404, detail="Role not found")
    return delete_role(db=db, role_id=role_id)