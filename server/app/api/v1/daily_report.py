from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
import traceback

from app.db.session import get_db
from app.schemas.daily_report import DailyReportCreate, DailyReportResponse
from app.crud import daily_report as crud
from app.crud.daily_report import get_all_reports_service
from app.models.project import Project
from app.api.dependencies import get_current_active_user
from app.models.user import User

from typing import Optional
from datetime import date

from app.models .daily_report import DailyReport, ManpowerUtilized, MachineryUtilized, ActivitiesCarriedOut




from app.api.dependencies import get_db

router = APIRouter(
    prefix="/daily-report",
    responses={404: {"description": "Not found"}},
)

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=dict
)
def create_daily_report(
    report: DailyReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Optional: Check if the current user is allowed to post to this project
    project = db.query(Project).filter(Project.id == report.project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    created_report = crud.create_daily_report(db, report)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "status": "success",
            "message": "Daily report created successfully",
            "data": jsonable_encoder(created_report)
        }
    )


from fastapi.responses import JSONResponse
from sqlalchemy.orm import joinedload

@router.get("/all", response_model=dict)
def get_all_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    date: Optional[date] = Query(None),
    project_id: Optional[int] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """
    Get all daily reports for the current user with optional filters and pagination.
    Includes pagination metadata and optional related info.
    """
    try:
        offset = (page - 1) * limit

        # Base query
        query = db.query(DailyReport).filter(DailyReport.user_id == current_user.id)

        if date:
            query = query.filter(DailyReport.date == date)
        if project_id:
            query = query.filter(DailyReport.project_id == project_id)

        total = query.count()  # Total number of reports

        reports = (
            query
            .options(joinedload(DailyReport.project), joinedload(DailyReport.user))  # if you want project/user info
            .order_by(DailyReport.date.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": "success",
                "message": "Daily reports fetched successfully",
                "total": total,
                "page": page,
                "limit": limit,
                "data": jsonable_encoder(reports)
            }
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch reports: {str(e)}"
        )


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    deleted = crud.delete_daily_report(db, report_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Report not found")

    # Per HTTP spec, 204 should not return a body
    return


# @router.put("/{report_id}", response_model=dict)
# def update_report(
#     report_id: int,
#     report_in: DailyReportCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_active_user),
# ):
#     updated_report = crud.update_daily_report(db, report_id, report_in)
#     if not updated_report:
#         raise HTTPException(status_code=404, detail="Report not found")

#     return {
#         "status": "success",
#         "message": "Report updated successfully",
#         "data": jsonable_encoder(updated_report)
#     }






@router.put("/{report_id}", response_model=dict)
def update_report(
    report_id: int,
    report_in: DailyReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    # Step 1: Check if the report exists
    existing_report = crud.get_daily_report_by_id(db, report_id)
    if not existing_report:
        raise HTTPException(status_code=404, detail="Report not found")

    # Optional: Validate foreign key if needed (e.g., project_id exists)
    if report_in.project_id:
        project = db.query(Project).filter(Project.id == report_in.project_id).first()
        if not project:
            raise HTTPException(status_code=400, detail="Invalid project_id")

    # Step 2: Perform update
    updated_report = crud.update_daily_report(db, report_id, report_in)

    return {
        "status": "success",
        "message": "Report updated successfully",
        "data": jsonable_encoder(updated_report)
    }




@router.get("/{report_id}", response_model=dict)
def get_report_by_id(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    report = crud_daily_report.get_daily_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return {
        "status": "success",
        "data": jsonable_encoder(report)
    }