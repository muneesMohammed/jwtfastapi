from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.crud.project import (
    get_project,
    get_projects,
    create_project,
    update_project,
    delete_project
)
from app.api.dependencies import get_current_active_admin
from app.schemas.user import UserInDB

router = APIRouter(prefix="/projects", tags=["Projects"])



@router.post("/", response_model=ProjectResponse, status_code=201)
def create_new_project(
    project: ProjectCreate,
     db: Session = Depends(get_db),
     current_user: UserInDB = Depends(get_current_active_admin)
     ):
    return create_project(db=db, project=project,current_user=current_user)

@router.get("/", response_model=list[ProjectResponse])
def read_all_projects(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
    ):
    return get_projects(db=db, skip=skip, limit=limit)

@router.get("/{project_id}", response_model=ProjectResponse)
def read_project(
    project_id: int, 
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
    ):
    db_project = get_project(db=db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_existing_project(
    project_id: int, 
    project_update: ProjectUpdate, 
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
    ):
    updated_project = update_project(db=db, project_id=project_id, project_update=project_update)
    if not updated_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated_project

@router.delete("/{project_id}")
def delete_existing_project(
    project_id: int, 
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
    ):
    result = delete_project(db=db, project_id=project_id)
    if not result:
        raise HTTPException(status_code=404, detail="Project not found")
    return result