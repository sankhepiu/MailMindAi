"""
POST /api/generate-subjects
Generates multiple email subject line options
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.email_schemas import SubjectGeneratorRequest, SubjectLinesResponse
from app.models.history import EmailHistory
from app import ai_service

router = APIRouter()


@router.post("/generate-subjects", response_model=SubjectLinesResponse)
async def generate_subjects(request: SubjectGeneratorRequest, db: Session = Depends(get_db)):
    """Generate 3-10 subject line options for an email."""
    try:
        subject_lines = ai_service.generate_subject_lines(
            email_context=request.email_context,
            count=request.count
        )
        
        history_entry = EmailHistory(
            action_type="subject",
            input_text=request.email_context,
            parameters=json.dumps({"count": request.count}),
            output_text=json.dumps(subject_lines)
        )
        db.add(history_entry)
        db.commit()
        db.refresh(history_entry)
        
        return SubjectLinesResponse(
            success=True,
            subject_lines=subject_lines,
            history_id=history_entry.id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Subject generation failed: {str(e)}")