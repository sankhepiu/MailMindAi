"""
Database model for storing email generation history
Each row = one AI generation request + result
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.database import Base


class EmailHistory(Base):
    __tablename__ = "email_history"

    id = Column(Integer, primary_key=True, index=True)
    
    # What type of action was performed
    # Values: generate, rewrite, tone_change, subject, reply, summarize
    action_type = Column(String(50), nullable=False, index=True)
    
    # The user's original input (prompt or original email)
    input_text = Column(Text, nullable=False)
    
    # Additional parameters (tone selected, rewrite option, etc.)
    parameters = Column(Text, nullable=True)  # Stored as JSON string
    
    # The AI-generated output
    output_text = Column(Text, nullable=False)
    
    # Timestamps - created_at is auto-set when row is inserted
    created_at = Column(DateTime, server_default=func.now())
    
    def __repr__(self):
        return f"<EmailHistory id={self.id} action={self.action_type} created={self.created_at}>"