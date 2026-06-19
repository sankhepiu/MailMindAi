"""
Pydantic Schemas — Define the shape of API requests and responses.

Why Pydantic?
- Automatic validation: If user sends wrong data type, FastAPI returns a clear error
- Auto-documentation: FastAPI uses these to generate the /docs page
- Type safety: Prevents bugs from unexpected data shapes
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


# ─── Enums (allowed values for dropdowns) ────────────────────────────────────

class ToneType(str, Enum):
    professional = "professional"
    friendly = "friendly"
    formal = "formal"
    casual = "casual"
    persuasive = "persuasive"
    confident = "confident"
    apologetic = "apologetic"


class RewriteOption(str, Enum):
    improve_professionalism = "improve_professionalism"
    make_concise = "make_concise"
    make_detailed = "make_detailed"
    improve_grammar = "improve_grammar"
    improve_readability = "improve_readability"


class ReplyType(str, Enum):
    positive = "positive"
    neutral = "neutral"
    rejection = "rejection"
    follow_up = "follow_up"


# ─── Request Schemas (what the frontend sends) ────────────────────────────────

class GenerateEmailRequest(BaseModel):
    purpose: str = Field(..., min_length=5, max_length=500,
                         description="What is the email about?",
                         example="Request internship opportunity at a software company")
    recipient: str = Field(..., min_length=2, max_length=100,
                           description="Who is the email addressed to?",
                           example="HR Manager at Google")
    context: Optional[str] = Field(None, max_length=1000,
                                   description="Additional context or details",
                                   example="I'm a final-year CS student with React and Python experience")
    tone: ToneType = Field(default=ToneType.professional,
                           description="The tone of the email")
    sender_name: Optional[str] = Field(None, max_length=100,
                                       description="Your name for the signature",
                                       example="Piu Sharma")


class RewriteEmailRequest(BaseModel):
    original_email: str = Field(..., min_length=20, max_length=5000,
                                description="The email text you want to rewrite")
    rewrite_option: RewriteOption = Field(...,
                                          description="How do you want to rewrite it?")
    additional_instructions: Optional[str] = Field(None, max_length=500,
                                                    description="Any specific instructions")


class ToneChangeRequest(BaseModel):
    original_email: str = Field(..., min_length=20, max_length=5000,
                                description="The email text to change the tone of")
    target_tone: ToneType = Field(..., description="The tone you want to convert to")


class SubjectGeneratorRequest(BaseModel):
    email_context: str = Field(..., min_length=10, max_length=1000,
                               description="Brief description of email content",
                               example="Requesting an internship at a software company for summer 2025")
    count: int = Field(default=6, ge=3, le=10,
                       description="Number of subject lines to generate (3-10)")


class ReplyGeneratorRequest(BaseModel):
    received_email: str = Field(..., min_length=20, max_length=5000,
                                description="The email you received and want to reply to")
    reply_type: ReplyType = Field(..., description="Type of reply to generate")
    additional_context: Optional[str] = Field(None, max_length=500,
                                              description="Any additional context for the reply")


class SummarizeEmailRequest(BaseModel):
    email_thread: str = Field(..., min_length=50, max_length=10000,
                              description="The long email thread to summarize")


class TemplateRequest(BaseModel):
    template_type: str = Field(..., description="Type of template to use",
                               example="internship_application")
    custom_details: Optional[str] = Field(None, max_length=500,
                                          description="Custom details to fill in")


# ─── Response Schemas (what the backend sends back) ───────────────────────────

class EmailResponse(BaseModel):
    success: bool
    result: str
    history_id: Optional[int] = None
    tokens_used: Optional[int] = None


class SubjectLinesResponse(BaseModel):
    success: bool
    subject_lines: List[str]
    history_id: Optional[int] = None


class SummaryResponse(BaseModel):
    success: bool
    key_points: List[str]
    action_items: List[str]
    important_dates: List[str]
    summary: str
    history_id: Optional[int] = None


class HistoryItem(BaseModel):
    id: int
    action_type: str
    input_text: str
    parameters: Optional[str]
    output_text: str
    created_at: str

    class Config:
        from_attributes = True  # Allows creating from SQLAlchemy models


class HistoryResponse(BaseModel):
    success: bool
    items: List[HistoryItem]
    total: int


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None