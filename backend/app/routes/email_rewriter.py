"""
POST /api/rewrite-email
Rewrites an existing email based on selected improvement option
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.email_schemas import RewriteEmailRequest, EmailResponse
from app.models.history import EmailHistory
from app import ai_service

router = APIRouter()


@router.post("/rewrite-email", response_model=EmailResponse)
async def rewrite_email(request: RewriteEmailRequest, db: Session = Depends(get_db)):
    """
    Rewrite an existing email with a specific improvement goal.
    
    Options: improve_professionalism / make_concise / make_detailed / improve_grammar / improve_readability
    """
    try:
        result = ai_service.rewrite_email(
            original_email=request.original_email,
            rewrite_option=request.rewrite_option.value,
            additional_instructions=request.additional_instructions
        )
        
        history_entry = EmailHistory(
            action_type="rewrite",
            input_text=request.original_email[:500],  # Store first 500 chars
            parameters=json.dumps({"rewrite_option": request.rewrite_option.value}),
            output_text=result
        )
        db.add(history_entry)
        db.commit()
        db.refresh(history_entry)
        
        return EmailResponse(success=True, result=result, history_id=history_entry.id)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rewrite failed: {str(e)}")