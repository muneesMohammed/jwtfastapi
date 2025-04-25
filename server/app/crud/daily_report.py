from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.models.daily_report import DailyReport, ManpowerUtilized, MachineryUtilized, ActivitiesCarriedOut
from app.schemas.daily_report import DailyReportCreate
from app.models.user import User

from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from sqlalchemy.orm import joinedload


def create_daily_report(db: Session, report_in: DailyReportCreate, current_user: User) -> DailyReport:
    report = DailyReport(
        date=report_in.date,
        project_id=report_in.project_id,
        remarks=report_in.remarks,
        user_id=current_user.id,
    )
    db.add(report)
    
    try:
        db.commit()
        db.refresh(report)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Invalid project_id: referenced project does not exist.")

    for mp in report_in.manpower:
        manpower = ManpowerUtilized(report_id=report.id, **mp.dict())
        db.add(manpower)

    for mach in report_in.machinery:
        machinery = MachineryUtilized(report_id=report.id, **mach.dict())
        db.add(machinery)

    for act in report_in.activities:
        activity = ActivitiesCarriedOut(report_id=report.id, **act.dict())
        db.add(activity)

    db.commit()
    return report


def get_all_reports_service(
    db: Session,
    current_user: User,
    date: Optional[date] = None,
    project_id: Optional[int] = None,
    offset: int = 0,
    limit: int = 10,
) -> List[DailyReport]:
    query = db.query(DailyReport).filter(DailyReport.user_id == current_user.id)

    if date:
        query = query.filter(DailyReport.date == date)
    if project_id:
        query = query.filter(DailyReport.project_id == project_id)

    return query.order_by(DailyReport.date.desc()).offset(offset).limit(limit).all()





def get_daily_report_by_id(db: Session, report_id: int) -> Optional[DailyReport]:
    return (
        db.query(DailyReport)
        .options(
            joinedload(DailyReport.manpower),
            joinedload(DailyReport.machinery),
            joinedload(DailyReport.activities),
        )
        .filter(DailyReport.id == report_id)
        .first()
    )



def delete_daily_report(db: Session, report_id: int) -> bool:
    report = db.query(DailyReport).filter(DailyReport.id == report_id).first()
    if not report:
        return False
    db.delete(report)
    db.commit()
    return True


def update_daily_report(
    db: Session,
    report_id: int,
    report_in: DailyReportCreate
) -> Optional[DailyReport]:
    report = db.query(DailyReport).filter(DailyReport.id == report_id).first()
    if not report:
        return None

    report.date = report_in.date
    report.project_id = report_in.project_id
    report.remarks = report_in.remarks

    # Step 1: Delete existing associated records
    db.query(ManpowerUtilized).filter(ManpowerUtilized.report_id == report.id).delete()
    db.query(MachineryUtilized).filter(MachineryUtilized.report_id == report.id).delete()
    db.query(ActivitiesCarriedOut).filter(ActivitiesCarriedOut.report_id == report.id).delete()

    # Step 2: Add updated records
    for mp in report_in.manpower:
        manpower = ManpowerUtilized(report_id=report.id, **mp.dict())
        db.add(manpower)

    for mach in report_in.machinery:
        machinery = MachineryUtilized(report_id=report.id, **mach.dict())
        db.add(machinery)

    for act in report_in.activities:
        activity = ActivitiesCarriedOut(report_id=report.id, **act.dict())
        db.add(activity)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Invalid project_id: referenced project does not exist.")

    db.refresh(report)
    return report
