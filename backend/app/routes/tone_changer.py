"""
POST /api/change-tone
Changes the tone of an email while preserving its content
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.email_schemas import ToneChangeRequest, EmailResponse
from app.models.history import EmailHistory
from app import ai_service

router = APIRouter()


@router.post("/change-tone", response_model=EmailResponse)
async def change_tone(request: ToneChangeRequest, db: Session = Depends(get_db)):
    """
    Convert an email to a different tone.
    
    Tones: professional / friendly / formal / casual / persuasive / confident / apologetic
    """
    try:
        result = ai_service.change_tone(
            original_email=request.original_email,
            target_tone=request.target_tone.value
        )
        
        history_entry = EmailHistory(
            action_type="tone_change",
            input_text=request.original_email[:500],
            parameters=json.dumps({"target_tone": request.target_tone.value}),
            output_text=result
        )
        db.add(history_entry)
        db.commit()
        db.refresh(history_entry)
        
        return EmailResponse(success=True, result=result, history_id=history_entry.id)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tone change failed: {str(e)}")