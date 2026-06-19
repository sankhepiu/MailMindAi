"""
GET /api/history - Get all email history
GET /api/history/{id} - Get specific history item
DELETE /api/history/{id} - Delete a history item
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.schemas.email_schemas import HistoryResponse, HistoryItem
from app.models.history import EmailHistory

router = APIRouter()


@router.get("/history", response_model=HistoryResponse)
async def get_history(
    db: Session = Depends(get_db),
    search: str = Query(None, description="Search in input text"),
    action_type: str = Query(None, description="Filter by action type"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0)
):
    """
    Get email generation history with optional search and filters.
    Supports pagination with limit/offset.
    """
    query = db.query(EmailHistory)
    
    # Filter by action type if provided
    if action_type:
        query = query.filter(EmailHistory.action_type == action_type)
    
    # Search in input text
    if search:
        query = query.filter(
            or_(
                EmailHistory.input_text.contains(search),
                EmailHistory.output_text.contains(search)
            )
        )
    
    total = query.count()
    items = query.order_by(EmailHistory.created_at.desc()).offset(offset).limit(limit).all()
    
    history_items = [
        HistoryItem(
            id=item.id,
            action_type=item.action_type,
            input_text=item.input_text,
            parameters=item.parameters,
            output_text=item.output_text,
            created_at=str(item.created_at)
        )
        for item in items
    ]
    
    return HistoryResponse(success=True, items=history_items, total=total)


@router.get("/history/{history_id}", response_model=HistoryItem)
async def get_history_item(history_id: int, db: Session = Depends(get_db)):
    """Get a specific history item by ID."""
    item = db.query(EmailHistory).filter(EmailHistory.id == history_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="History item not found")
    
    return HistoryItem(
        id=item.id,
        action_type=item.action_type,
        input_text=item.input_text,
        parameters=item.parameters,
        output_text=item.output_text,
        created_at=str(item.created_at)
    )


@router.delete("/history/{history_id}")
async def delete_history_item(history_id: int, db: Session = Depends(get_db)):
    """Delete a specific history item."""
    item = db.query(EmailHistory).filter(EmailHistory.id == history_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="History item not found")
    
    db.delete(item)
    db.commit()
    
    return {"success": True, "message": f"History item {history_id} deleted"}


@router.delete("/history")
async def clear_all_history(db: Session = Depends(get_db)):
    """Clear all history entries."""
    db.query(EmailHistory).delete()
    db.commit()
    return {"success": True, "message": "All history cleared"}