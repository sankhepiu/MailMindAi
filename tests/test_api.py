"""
API Tests for AI Email Assistant Backend
Run with: pytest tests/ -v

These tests use a test database (not your real one) and mock the AI service
so you don't burn API credits during testing.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use in-memory SQLite for tests (doesn't affect your real database)
TEST_DATABASE_URL = "sqlite:///./test_email_assistant.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override the database dependency for tests
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="module")
def client():
    """Create a test client with a test database."""
    # Import here to avoid circular imports
    import sys
    import os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
    
    from app.main import app
    from app.database import get_db, Base
    
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as c:
        yield c
    
    # Cleanup
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


# ─── Health Check ──────────────────────────────────────────────────────────────

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "AI Email Assistant" in response.json()["message"]


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


# ─── Email Generator ──────────────────────────────────────────────────────────

@patch("app.ai_service.generate_email")
def test_generate_email_success(mock_ai, client):
    mock_ai.return_value = "Subject: Test Email\n\nDear Manager,\n\nTest email body.\n\nBest regards,\nTest User"
    
    response = client.post("/api/generate-email", json={
        "purpose": "Request an internship at a tech company",
        "recipient": "HR Manager",
        "tone": "professional",
        "sender_name": "Test User"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "result" in data
    assert len(data["result"]) > 0
    mock_ai.assert_called_once()


def test_generate_email_missing_required_fields(client):
    response = client.post("/api/generate-email", json={
        "purpose": "Test"
        # Missing 'recipient' which is required
    })
    assert response.status_code == 422  # Validation error


def test_generate_email_invalid_tone(client):
    response = client.post("/api/generate-email", json={
        "purpose": "Test email purpose",
        "recipient": "Test Recipient",
        "tone": "invalid_tone"  # Not a valid ToneType enum value
    })
    assert response.status_code == 422


# ─── Email Rewriter ───────────────────────────────────────────────────────────

@patch("app.ai_service.rewrite_email")
def test_rewrite_email_success(mock_ai, client):
    mock_ai.return_value = "Improved version of the email."
    
    response = client.post("/api/rewrite-email", json={
        "original_email": "hey can u help me with the project its due soon and i need assistance asap thanks",
        "rewrite_option": "improve_professionalism"
    })
    
    assert response.status_code == 200
    assert response.json()["success"] is True


# ─── Tone Changer ─────────────────────────────────────────────────────────────

@patch("app.ai_service.change_tone")
def test_change_tone_success(mock_ai, client):
    mock_ai.return_value = "Casual version of the email."
    
    response = client.post("/api/change-tone", json={
        "original_email": "Dear Sir/Madam, I am writing to formally request your assistance with the aforementioned matter.",
        "target_tone": "casual"
    })
    
    assert response.status_code == 200
    assert response.json()["success"] is True


# ─── Subject Generator ────────────────────────────────────────────────────────

@patch("app.ai_service.generate_subject_lines")
def test_generate_subjects_success(mock_ai, client):
    mock_ai.return_value = [
        "Software Engineering Internship Inquiry",
        "Seeking Summer 2025 Internship Opportunity",
        "CS Student Looking for Internship",
        "Application for Software Development Internship",
        "Internship Application — Final Year CS Student",
        "Request: Software Engineering Internship"
    ]
    
    response = client.post("/api/generate-subjects", json={
        "email_context": "Requesting a software engineering internship at a tech company",
        "count": 6
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "subject_lines" in data
    assert len(data["subject_lines"]) == 6


# ─── History ──────────────────────────────────────────────────────────────────

def test_get_history_empty(client):
    """History should return empty list when no entries exist."""
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "items" in data


@patch("app.ai_service.generate_email")
def test_history_saves_after_generation(mock_ai, client):
    """After generating an email, it should appear in history."""
    mock_ai.return_value = "Subject: Test\n\nTest email content."
    
    # Generate an email
    client.post("/api/generate-email", json={
        "purpose": "Test purpose for history",
        "recipient": "Test Recipient",
        "tone": "professional"
    })
    
    # Check history
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1


def test_get_nonexistent_history_item(client):
    response = client.get("/api/history/99999")
    assert response.status_code == 404