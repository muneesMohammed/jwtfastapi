from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from datetime import date
import traceback

from app.db.session import get_db
from app.schemas.daily_report import DailyReportCreate
from app.models.project import Project
from app.models.user import User
from app.models.daily_report import DailyReport

from app.api.dependencies import get_current_active_user

from app.crud.daily_report import (
    get_all_reports_service,
    create_daily_report,
    delete_daily_report,
    get_daily_report_by_id,
    update_daily_report,
)


router = APIRouter(
    prefix="/daily-report",
    tags=["Daily Report"],
    responses={404: {"description": "Not found"}},
)

# Create Daily Report
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=dict)
def create_report(
    report: DailyReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    project = db.query(Project).filter(Project.id == report.project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    created_report = create_daily_report(db, report, current_user)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "status": "success",
            "message": "Daily report created successfully",
            "data": jsonable_encoder(created_report),
        },
    )


# Get All Reports
@router.get("/all", response_model=dict)
def get_all_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    date: Optional[date] = Query(None),
    project_id: Optional[int] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    try:
        offset = (page - 1) * limit
        query = db.query(DailyReport).filter(DailyReport.user_id == current_user.id)

        if date:
            query = query.filter(DailyReport.date == date)
        if project_id:
            query = query.filter(DailyReport.project_id == project_id)

        total = query.count()
        reports = (
            query.options(
                joinedload(DailyReport.project),
                joinedload(DailyReport.user),
            )
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
                "data": jsonable_encoder(reports),
            },
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch reports: {str(e)}",
        )


# Get Report by ID
@router.get("/{report_id}", response_model=dict)
def get_report_by_id(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    report = get_daily_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return {
        "status": "success",
        "data": jsonable_encoder(report),
    }



# Update Report
@router.put("/{report_id}", response_model=dict)
def update_report(
    report_id: int,
    report_in: DailyReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    existing_report = get_daily_report_by_id(db, report_id)
    if not existing_report:
        raise HTTPException(status_code=404, detail="Report not found")

    if report_in.project_id:
        project = db.query(Project).filter(Project.id == report_in.project_id).first()
        if not project:
            raise HTTPException(status_code=400, detail="Invalid project_id")

    updated_report = update_daily_report(db, report_id, report_in)

    return {
        "status": "success",
        "message": "Report updated successfully",
        "data": jsonable_encoder(updated_report),
    }


# Delete Report
@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    deleted = delete_daily_report(db, report_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Report not found")
    return
