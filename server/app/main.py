from fastapi import FastAPI, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from sqlalchemy.orm import Session
import traceback

from app.db.session import engine, get_db
from app.models.user import Base as UserBase, Role
from app.models.project import Base as ProjectBase
from app.models.daily_report import Base as ReportBase
from app.core.config import settings, logger
from app.crud.user import get_user_by_email, create_user
from app.setup import setup_first_admin
from app.api.v1 import api_router  # Central router for all v1 routes

# ✅ Create all tables (Optional if you're using Alembic migrations)
UserBase.metadata.create_all(bind=engine)
ProjectBase.metadata.create_all(bind=engine)
ReportBase.metadata.create_all(bind=engine)

# ✅ Initialize FastAPI app
app = FastAPI(
    title="EMTS System",
    debug=settings.DEBUG
)

# ✅ Force HTTPS (Optional - use only in production or behind reverse proxy)
app.add_middleware(HTTPSRedirectMiddleware)

# ✅ CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://jwtfastapi.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include all versioned API routers
app.include_router(api_router, prefix="/api/v1")

# ✅ Log each request
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Completed: {request.method} {request.url} - Status {response.status_code}")
        return response
    except Exception as ex:
        logger.error(f"Failed: {request.method} {request.url} - Error: {str(ex)}")
        logger.error(traceback.format_exc())
        raise

# ✅ Handle validation errors globally
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {str(exc)}")
    body_content = await request.form() if "multipart/form-data" in request.headers.get("content-type", "") else exc.body
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": jsonable_encoder(body_content)},
    )

# ✅ Admin setup endpoint (manual trigger)
@app.post("/setup-admin")
async def setup_admin(db: Session = Depends(get_db)):
    admin = get_user_by_email(db, settings.FIRST_SUPERUSER_EMAIL)
    if admin:
        return {"message": "Admin user already exists"}
    
    admin_data = {
        "email": settings.FIRST_SUPERUSER_EMAIL,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
        "role": Role.ADMIN,
        "is_active": True,
        "is_verified": True
    }
    create_user(db, admin_data)
    return {"message": "Admin user created successfully"}

# ✅ Root redirect to docs or welcome message
@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

# ✅ Auto-setup first admin on startup
@app.on_event("startup")
def on_startup():
    db = next(get_db())
    setup_first_admin(db)
