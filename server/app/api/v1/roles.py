from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db  # your database session dependency
from app.models.role import Role  # SQLAlchemy model
from app.api.dependencies import get_current_active_admin
from app.schemas.user import UserInDB

router = APIRouter(
    prefix="/roles",
    tags=["Roles"]
)

@router.get("/", response_model=list[dict])
def get_roles(
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_admin)
):
    """Return available user roles as list of dicts with id and name"""
    roles = db.query(Role).all()
    return [{"id": role.id, "name": role.name} for role in roles]
