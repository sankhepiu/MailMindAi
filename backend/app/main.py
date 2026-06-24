"""
AI Email Assistant - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import engine, Base
from app.routes import email_generator, email_rewriter, tone_changer, subject_generator, reply_generator, summarizer, history


# Create database tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="AI Email Assistant API",
    description="A powerful AI-powered email assistant built with FastAPI and Gemini AI",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS - allows your Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://mail-mind-bp22ltjgb-piuu.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all route modules
app.include_router(email_generator.router, prefix="/api", tags=["Email Generator"])
app.include_router(email_rewriter.router, prefix="/api", tags=["Email Rewriter"])
app.include_router(tone_changer.router, prefix="/api", tags=["Tone Changer"])
app.include_router(subject_generator.router, prefix="/api", tags=["Subject Generator"])
app.include_router(reply_generator.router, prefix="/api", tags=["Reply Generator"])
app.include_router(summarizer.router, prefix="/api", tags=["Summarizer"])
app.include_router(history.router, prefix="/api", tags=["History"])


@app.get("/")
def root():
    return {
        "message": "AI Email Assistant API is running",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
