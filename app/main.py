 
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import auth, users, admin
from app.database import Base, engine
import uvicorn
import os
from logging.handlers import RotatingFileHandler

# Create logs directory if it doesn't exist
os.makedirs("app/logs", exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        RotatingFileHandler(
            "app/logs/app.log",
            maxBytes=1024 * 1024 * 5,  # 5MB
            backupCount=5
        ),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="FastAPI JWT Auth",
    description="Professional JWT Authentication with Role-Based Access Control",
    version="1.0.0",
    debug=settings.DEBUG
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(admin.router)

@app.on_event("startup")
async def startup():
    logger.info("Starting up...")
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")

@app.on_event("shutdown")
async def shutdown():
    logger.info("Shutting down...")

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI JWT Auth"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info"
    )