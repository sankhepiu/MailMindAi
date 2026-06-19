"""
POST /api/generate-reply
Generates contextual replies to received emails
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.email_schemas import ReplyGeneratorRequest, EmailResponse
from app.models.history import EmailHistory
from app import ai_service

router = APIRouter()


@router.post("/generate-reply", response_model=EmailResponse)
async def generate_reply(request: ReplyGeneratorRequest, db: Session = Depends(get_db)):
    """
    Generate a reply to a received email.
    
    Reply types: positive / neutral / rejection / follow_up
    """
    try:
        result = ai_service.generate_reply(
            received_email=request.received_email,
            reply_type=request.reply_type.value,
            additional_context=request.additional_context
        )
        
        history_entry = EmailHistory(
            action_type="reply",
            input_text=request.received_email[:500],
            parameters=json.dumps({"reply_type": request.reply_type.value}),
            output_text=result
        )
        db.add(history_entry)
        db.commit()
        db.refresh(history_entry)
        
        return EmailResponse(success=True, result=result, history_id=history_entry.id)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reply generation failed: {str(e)}")