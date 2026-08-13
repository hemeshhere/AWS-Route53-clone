from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, hosted_zones, dns_records
from .database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Route 53 Clone API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- NEW: Global Exception Handler ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # In a production environment, you would log 'exc' to a monitoring service here
    print(f"CRITICAL ERROR: {exc}") 
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."},
    )
# -------------------------------------

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(hosted_zones.router, prefix="/api/hosted-zones", tags=["Hosted Zones"])
app.include_router(dns_records.router, prefix="/api", tags=["DNS Records"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Route 53 Clone API"}