from fastapi import FastAPI, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
import traceback

from sqlalchemy.orm import Session

from app.db.session import engine, get_db
from app.models.user import Base as UserBase
from app.models.role import Role
from app.models.project import Base as ProjectBase
from app.models.daily_report import Base as ReportBase
from app.core.config import settings, logger
from app.crud.user import get_user_by_email, create_user
from app.crud.role import get_role_by_name
from app.schemas.user import UserCreate
from app.setup import setup_first_admin, seed_roles
from app.api.v1 import api_router

# ✅ Create all tables (Optional if not using Alembic)
UserBase.metadata.create_all(bind=engine)
ProjectBase.metadata.create_all(bind=engine)
ReportBase.metadata.create_all(bind=engine)

# ✅ Initialize FastAPI app
app = FastAPI(
    title="EMTS System",
    debug=settings.DEBUG
)

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

# ✅ Include versioned API routers
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

# ✅ Global validation error handler
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

    role = get_role_by_name(db, "admin")
    if not role:
        return {"error": "Admin role not found. Please seed roles first."}

    admin_data = UserCreate(
        email=settings.FIRST_SUPERUSER_EMAIL,
        password=settings.FIRST_SUPERUSER_PASSWORD,
        full_name="Admin User",
        role_id=role.id,
        is_active=True,
        is_verified=True
    )
    create_user(db, admin_data)
    return {"message": "Admin user created successfully"}

# ✅ Redirect root to docs
@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

# ✅ Startup event to seed roles and admin user
@app.on_event("startup")
def on_startup():
    db = next(get_db())
    try:
        seed_roles(db)            # Seed roles: admin, user, foreman, etc.
        setup_first_admin(db)     # Create admin user if not already created
    finally:
        db.close()
