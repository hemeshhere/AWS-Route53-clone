from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine, get_db
from .routers import auth, hosted_zones
from .dependencies.auth import get_current_user

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Route53 Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register our routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(hosted_zones.router, prefix="/api/hosted-zones", tags=["Hosted Zones"])

# Seed demo user on startup
@app.on_event("startup")
def seed_demo_user():
    db = next(get_db())
    if not db.query(models.User).first():
        print("Creating demo user...")
        demo_user = models.User(
            email="admin@route53.com",
            password_hash="password123",
            name="AWS Admin"
        )
        db.add(demo_user)
        db.commit()

# Health check
@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "FastAPI backend is running with Auth and Hosted Zones!"}

# Profile route
@app.get("/api/auth/me", tags=["Authentication"])
def get_my_profile(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name
    }