# from fastapi import APIRouter

# from .auth import router as auth_router
# from .users import router as user_router
# from .daily_reports import router as daily_report_router

# api_router = APIRouter()
# api_router.include_router(auth_router)
# api_router.include_router(user_router)
# api_router.include_router(daily_report_router)




# app/api/v1/__init__.py

from fastapi import APIRouter
from . import auth, user, daily_report

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(user.router, prefix="/user", tags=["Users"])
api_router.include_router(daily_report.router, tags=["Daily Report"])
