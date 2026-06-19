"""
POST /api/generate-email
Generates a complete email from user inputs
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.email_schemas import GenerateEmailRequest, EmailResponse
from app.models.history import EmailHistory
from app import ai_service

router = APIRouter()


@router.post("/generate-email", response_model=EmailResponse)
async def generate_email(request: GenerateEmailRequest, db: Session = Depends(get_db)):
    """
    Generate a professional email from a short prompt.
    
    - **purpose**: What is the email about?
    - **recipient**: Who are you emailing?
    - **context**: Any additional details?
    - **tone**: professional / friendly / formal / casual / persuasive / confident / apologetic
    - **sender_name**: Your name for the signature
    """
    try:
        # Call the AI service
        result = ai_service.generate_email(
            purpose=request.purpose,
            recipient=request.recipient,
            context=request.context,
            tone=request.tone.value,
            sender_name=request.sender_name
        )
        
        # Save to history database
        history_entry = EmailHistory(
            action_type="generate",
            input_text=request.purpose,
            parameters=json.dumps({
                "recipient": request.recipient,
                "tone": request.tone.value,
                "context": request.context
            }),
            output_text=result
        )
        db.add(history_entry)
        db.commit()
        db.refresh(history_entry)
        
        return EmailResponse(
            success=True,
            result=result,
            history_id=history_entry.id
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI generation failed: {str(e)}"
        )