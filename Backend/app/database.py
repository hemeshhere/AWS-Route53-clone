from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# The URL for our database. This will create a file named "route53.db" in the root backend folder.
SQLALCHEMY_DATABASE_URL = "sqlite:///./route53.db"

# The "engine" is responsible for actually talking to the database.
# connect_args={"check_same_thread": False} is required only for SQLite in FastAPI.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# A "Session" is a temporary workspace for your database queries.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# "Base" is the main class that all our database models will inherit from.
Base = declarative_base()

# Dependency function to give our routes access to the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()