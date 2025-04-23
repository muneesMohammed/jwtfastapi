from fastapi import FastAPI, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.orm import Session
import traceback

from app.api.v1 import auth, user, daily_report  
from app.db.session import engine, get_db
from app.models.user import Base as UserBase, Role
from app.models.project import Base as ProjectBase
from app.models.daily_report import Base as ReportBase
from app.core.config import settings, logger
from app.crud.user import get_user_by_email, create_user
from app.setup import setup_first_admin
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

# Create all tables (You can also use Alembic later)
UserBase.metadata.create_all(bind=engine)
ProjectBase.metadata.create_all(bind=engine)
ReportBase.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="EMTS System",
    debug=settings.DEBUG
)

# ✅ Add HTTPS Redirection Middleware
app.add_middleware(HTTPSRedirectMiddleware)

# ✅ CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://jwtfastapi.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(user.router, prefix="/api/v1/user", tags=["users"])
app.include_router(daily_report.router, prefix="/api/v1", tags=["Daily Report"])

# ✅ Request Logger Middleware
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

# ✅ Validation Exception Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {str(exc)}")
    body_content = await request.form() if "multipart/form-data" in request.headers.get("content-type", "") else exc.body
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": jsonable_encoder(body_content)},
    )

# ✅ Admin Setup Route
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

# ✅ Root Endpoint
@app.get("/")
async def read_root(request: Request):
    logger.debug("Root endpoint accessed")
    return {"message": "Auth System API"}

# ✅ On Startup Hook
@app.on_event("startup")
def on_startup():
    db = next(get_db())
    setup_first_admin(db)
