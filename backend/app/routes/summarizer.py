"""
POST /api/summarize-email
Summarizes long email threads into structured insights
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.email_schemas import SummarizeEmailRequest, SummaryResponse
from app.models.history import EmailHistory
from app import ai_service

router = APIRouter()


@router.post("/summarize-email", response_model=SummaryResponse)
async def summarize_email(request: SummarizeEmailRequest, db: Session = Depends(get_db)):
    """
    Summarize a long email thread.
    
    Returns: key_points, action_items, important_dates, and an overall summary.
    """
    try:
        result = ai_service.summarize_email(email_thread=request.email_thread)
        
        history_entry = EmailHistory(
            action_type="summarize",
            input_text=request.email_thread[:500],
            parameters=None,
            output_text=json.dumps(result)
        )
        db.add(history_entry)
        db.commit()
        db.refresh(history_entry)
        
        return SummaryResponse(
            success=True,
            key_points=result.get("key_points", []),
            action_items=result.get("action_items", []),
            important_dates=result.get("important_dates", []),
            summary=result.get("summary", ""),
            history_id=history_entry.id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")