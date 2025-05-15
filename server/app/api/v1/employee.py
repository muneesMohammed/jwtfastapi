from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeUpdate
from app.crud.employee import (
    get_employee,
    get_employees,
    create_employee,
    update_employee,
    delete_employee
)
from app.api.dependencies import get_current_active_admin
from app.schemas.user import UserInDB




router = APIRouter(prefix="/employees", tags=["Employees"])


@router.post("/", response_model=EmployeeResponse, status_code=201)
def create_new_employee(
    employee: EmployeeCreate, 
    db: Session = Depends(get_db), 
    current_user: UserInDB = Depends(get_current_active_admin)
    ):
    return create_employee(db=db, employee=employee, current_user=current_user)



@router.get("/", response_model=list[EmployeeResponse])
def read_all_employees(
    skip: int = 0,
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
    ):
    return get_employees(db=db, skip=skip, limit=limit)



@router.get("/{employee_id}", response_model=EmployeeResponse)
def read_employee(
    employee_id: int, 
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
    ):
    db_employee = get_employee(db=db, employee_id=employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee



@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_existing_employee(
    employee_id: int,
    employee_update: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
    ):
    updated_employee = update_employee(db=db, employee_id=employee_id, employee_update=employee_update)
    if not updated_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return updated_employee




@router.delete("/{employee_id}")
def delete_existing_employee(
    employee_id: int, 
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
    ):
    result = delete_employee(db=db, employee_id=employee_id)
    if not result:
        raise HTTPException(status_code=404, detail="Employee not found")
    return result



















