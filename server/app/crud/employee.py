import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError, DBAPIError
from fastapi import HTTPException
from app.models.user import User
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate

logger = logging.getLogger(__name__)


def get_employee(db: Session, employee_id: int):
    try:
        return db.query(Employee).filter(Employee.id == employee_id).first()
    except SQLAlchemyError as e:
        logger.error(f"Error fetching employee {employee_id}: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred")


def get_employees(db: Session, skip: int = 0, limit: int = 100):
    try:
        return db.query(Employee).offset(skip).limit(limit).all()
    except SQLAlchemyError as e:
        logger.error(f"Error fetching employee list: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred")

def create_employee(db: Session, employee: EmployeeCreate, current_user: User):
    try:
        db_employee = Employee(**employee.model_dump())
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        # Convert hire_date to string before returning
        if db_employee.hire_date:
            db_employee.hire_date = db_employee.hire_date.strftime("%Y-%m-%d")

        return db_employee



    except IntegrityError as e:
        db.rollback()
        logger.error(f"Integrity error during employee creation: {e.orig}")
        raise HTTPException(status_code=400, detail="Employee already exists or violates constraints.")
    except DBAPIError as e:
        db.rollback()
        logger.error(f"Database API error during employee creation: {e.orig}")
        raise HTTPException(status_code=500, detail="Database API error occurred.")
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Unexpected error during employee creation: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create employee")


def update_employee(db: Session, employee_id: int, employee_update: EmployeeUpdate):
    try:
        db_employee = db.query(Employee).get(employee_id)
        if not db_employee:
            raise HTTPException(status_code=404, detail="Employee not found")

        update_data = employee_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_employee, key, value)

        db.commit()
        db.refresh(db_employee)
        return db_employee
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Integrity error during update: {e.orig}")
        raise HTTPException(status_code=400, detail="Update violates unique or foreign key constraint.")
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Error updating employee {employee_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update employee")


def delete_employee(db: Session, employee_id: int):
    try:
        db_employee = db.query(Employee).get(employee_id)
        if not db_employee:
            raise HTTPException(status_code=404, detail="Employee not found")

        db.delete(db_employee)
        db.commit()
        return {"message": "Employee deleted successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Error deleting employee {employee_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete employee")
