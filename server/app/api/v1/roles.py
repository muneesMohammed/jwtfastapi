from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.role import RoleCreate, RoleUpdate, RoleResponse
from app.crud.role import (
    get_role,
    get_roles,
    create_role,
    update_role,
    delete_role,
    get_role_by_name
)
from app.api.dependencies import get_current_active_admin
from app.schemas.user import UserInDB

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get("/", response_model=list[RoleResponse])
def read_all_roles(
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
):
    """Return all roles as list of RoleResponse"""
    return get_roles(db=db)

@router.get("/{role_id}", response_model=RoleResponse)
def read_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
):
    role = get_role(db=db, role_id=role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

@router.post("/", response_model=RoleResponse, status_code=201)
def create_new_role(
    role: RoleCreate,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
):
    existing_role = get_role_by_name(db, name=role.name)
    if existing_role:
        raise HTTPException(status_code=400, detail="Role already exists")

    return create_role(db=db, role=role)

@router.put("/{role_id}", response_model=RoleResponse)
def update_existing_role(
    role_id: int,
    role_update: RoleUpdate,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
):
    updated_role = update_role(db=db, role_id=role_id, role_update=role_update)
    if not updated_role:
        raise HTTPException(status_code=404, detail="Role not found")
    return updated_role

@router.delete("/{role_id}")
def delete_existing_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
):
    result = delete_role(db=db, role_id=role_id)
    if not result:
        raise HTTPException(status_code=404, detail="Role not found")
    return {"message": "Role deleted successfully"}