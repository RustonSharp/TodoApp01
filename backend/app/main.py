from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_tables
from app.routers import todos
from app.config import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="A simple Todo API built with FastAPI"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router registration
app.include_router(todos.router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    create_tables()

@app.get("/")
async def root():
    return {"message": "Welcome to Todo API", "version": settings.app_version}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}