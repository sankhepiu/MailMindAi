"""
Database configuration using SQLAlchemy ORM
SQLite for development, easy to swap to PostgreSQL for production
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Get database URL from environment, default to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./email_assistant.db")

# connect_args is only needed for SQLite (handles threading)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# SessionLocal is a factory - calling it creates a new DB session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all our database models
Base = declarative_base()


def get_db():
    """
    Dependency function for FastAPI routes.
    Creates a DB session, yields it, and closes it after the request.
    Usage: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()