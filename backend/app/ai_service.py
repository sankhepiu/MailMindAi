"""
AI Service Layer — All Gemini API interactions happen here.

PROMPT ENGINEERING PRINCIPLES USED:
1. System prompts: Set the AI's role and constraints upfront
2. Few-shot examples: Show the AI what good output looks like
3. Output format specification: Tell AI exactly what structure to return
4. Temperature control: Lower = more consistent, Higher = more creative
5. Clear delimiters: Separate sections of the prompt clearly
"""

import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Using gemini-2.5-flash: fast, cheap, great for text tasks
MODEL_NAME = "gemini-2.5-flash"


def get_model(temperature: float = 0.7):
    """
    Create a Gemini model with specific settings.
    
    Temperature guide:
    - 0.3: Very consistent, good for grammar fixes and summarization
    - 0.7: Balanced, good for email generation (our default)
    - 0.9: More creative, good for subject lines (need variety)
    """
    return genai.GenerativeModel(
        model_name=MODEL_NAME,
        generation_config=genai.types.GenerationConfig(
            temperature=temperature,
            max_output_tokens=1500,
        )
    )


# ─── 1. EMAIL GENERATOR ───────────────────────────────────────────────────────

def generate_email(purpose: str, recipient: str, context: str = None, 
                   tone: str = "professional", sender_name: str = None) -> str:
    """
    Generate a complete email from scratch.
    
    Prompt Design:
    - We give the AI a clear ROLE ("expert email writer")
    - We specify exact OUTPUT FORMAT (Subject + Body + Signature)
    - We include all user inputs as labeled sections
    - Few-shot example embedded in the system prompt shows quality bar
    """
    
    system_prompt = """You are an expert email writer with 10+ years of professional communication experience.
    
Your task is to write complete, polished emails that are ready to send.

RULES:
- Always include: Subject line, proper greeting, well-structured body, professional closing
- Match the specified tone throughout the entire email
- Keep emails concise but complete — no fluff
- Use natural language, not robotic/template-sounding text
- Format exactly as:
  Subject: [subject line here]
  
  [Full email body with greeting and closing]

EXAMPLE OF GOOD OUTPUT:
Subject: Software Engineering Internship Application — Summer 2025

Dear Hiring Manager,

I am writing to express my strong interest in a Software Engineering internship position at your organization. As a final-year Computer Science student at VIT Vellore with hands-on experience in React, Python, and AWS, I am eager to contribute to your team while furthering my technical skills.

During my studies, I developed MindWell, a full-stack mental health platform featuring an AI chatbot and AWS deployment, which gave me practical experience in end-to-end product development. I am confident this background aligns well with your team's needs.

I would welcome the opportunity to discuss how I can contribute to your organization. I have attached my resume for your review and am available for an interview at your convenience.

Thank you for considering my application.

Warm regards,
[Sender Name]"""

    user_prompt = f"""Write a {tone} email with these details:

PURPOSE: {purpose}
RECIPIENT: {recipient}
{f'ADDITIONAL CONTEXT: {context}' if context else ''}
{f'SENDER NAME: {sender_name}' if sender_name else ''}
TONE: {tone}

Write the complete email now:"""

    model = get_model(temperature=0.7)
    response = model.generate_content(f"{system_prompt}\n\n{user_prompt}")
    return response.text


# ─── 2. EMAIL REWRITER ────────────────────────────────────────────────────────

def rewrite_email(original_email: str, rewrite_option: str, 
                  additional_instructions: str = None) -> str:
    """
    Rewrite an existing email based on a selected improvement type.
    
    Prompt Design:
    - We define each rewrite option precisely so AI knows exactly what to do
    - We include the ORIGINAL email clearly labeled so AI doesn't confuse it with instructions
    - We ask for ONLY the rewritten email, not explanations (clean output)
    """
    
    option_instructions = {
        "improve_professionalism": "Elevate the language to sound more professional and polished. Remove casual language, fix tone, and ensure it reads like a senior professional wrote it.",
        "make_concise": "Remove all fluff, repetition, and unnecessary sentences. Keep every word essential. Aim for 40-60% shorter while preserving all key information.",
        "make_detailed": "Expand the email with more context, specific details, and stronger reasoning. Add supporting points where appropriate.",
        "improve_grammar": "Fix all grammatical errors, punctuation mistakes, spelling errors, and awkward sentence structures. Preserve the original voice and content exactly.",
        "improve_readability": "Restructure for maximum clarity. Use shorter sentences, better paragraph breaks, and clearer transitions. The reader should understand immediately."
    }
    
    instruction = option_instructions.get(rewrite_option, "Improve the email overall")
    
    prompt = f"""You are an expert email editor. Your job is to rewrite emails to make them better.

REWRITE TASK: {instruction}

{f'ADDITIONAL INSTRUCTIONS: {additional_instructions}' if additional_instructions else ''}

ORIGINAL EMAIL:
---
{original_email}
---

Write ONLY the improved email below. Do not include explanations, comparisons, or commentary:"""

    model = get_model(temperature=0.4)  # Lower temp = more controlled edits
    response = model.generate_content(prompt)
    return response.text


# ─── 3. TONE CHANGER ──────────────────────────────────────────────────────────

def change_tone(original_email: str, target_tone: str) -> str:
    """
    Convert email tone while preserving all content and information.
    
    Prompt Design:
    - We EXPLICITLY tell the AI to preserve all information
    - We define what each tone means to avoid ambiguity
    - Critical constraint: "change ONLY the tone, not the facts"
    """
    
    tone_definitions = {
        "professional": "business-appropriate, polished, respectful, direct",
        "friendly": "warm, personable, approachable, uses first names, conversational",
        "formal": "highly formal, no contractions, traditional business language, very structured",
        "casual": "relaxed, conversational, uses contractions, like talking to a friend",
        "persuasive": "compelling, uses evidence and benefits, motivates action, strong call-to-action",
        "confident": "assertive, decisive, uses active voice, shows expertise and certainty",
        "apologetic": "genuinely remorseful, empathetic, takes responsibility, offers solutions"
    }
    
    tone_description = tone_definitions.get(target_tone, target_tone)
    
    prompt = f"""You are an expert at adapting email tone while preserving content.

TARGET TONE: {target_tone} — meaning: {tone_description}

CRITICAL RULES:
1. Preserve ALL information, facts, and key points from the original
2. Change ONLY the tone, word choice, and sentence structure
3. Keep the same length approximately
4. Do not add new information or remove existing information
5. Return ONLY the rewritten email, no explanations

ORIGINAL EMAIL:
---
{original_email}
---

Rewritten email with {target_tone} tone:"""

    model = get_model(temperature=0.5)
    response = model.generate_content(prompt)
    return response.text


# ─── 4. SUBJECT LINE GENERATOR ────────────────────────────────────────────────

def generate_subject_lines(email_context: str, count: int = 6) -> list[str]:
    """
    Generate multiple creative subject line options.
    
    Prompt Design:
    - We ask for JSON output for easy parsing (structured output)
    - We specify variety in style (question, benefit, direct, curiosity)
    - Higher temperature = more creative variety in options
    """
    
    prompt = f"""You are an expert at writing email subject lines that get opened.

EMAIL CONTEXT: {email_context}

Generate exactly {count} different subject line options. Vary the style:
- Some direct and clear
- Some that create curiosity
- Some that lead with the benefit/value
- Some shorter, some slightly longer
- Avoid clickbait or misleading lines

Return your response as a JSON array of strings ONLY. No other text.
Example format: ["Subject 1", "Subject 2", "Subject 3"]

Generate {count} subject lines now:"""

    model = get_model(temperature=0.9)  # High temp for creative variety
    response = model.generate_content(prompt)
    
    # Parse the JSON response
    try:
        text = response.text.strip()
        # Remove markdown code blocks if present
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        subjects = json.loads(text.strip())
        return subjects[:count]  # Ensure we don't return more than requested
    except json.JSONDecodeError:
        # Fallback: split by newlines if JSON parsing fails
        lines = [line.strip().lstrip("•-123456789. ") 
                 for line in response.text.split("\n") 
                 if line.strip() and len(line.strip()) > 5]
        return lines[:count]


# ─── 5. REPLY GENERATOR ───────────────────────────────────────────────────────

def generate_reply(received_email: str, reply_type: str, 
                   additional_context: str = None) -> str:
    """
    Generate a contextually appropriate reply to a received email.
    
    Prompt Design:
    - We show the AI the FULL received email for context
    - We define the emotional intent of each reply type
    - We ask AI to acknowledge key points from the original (shows it read it)
    """
    
    reply_instructions = {
        "positive": "Write an enthusiastic, agreeable reply. Express genuine interest, confirm details if needed, and show excitement or agreement with the sender's points.",
        "neutral": "Write a balanced, professional reply. Acknowledge the email, respond to key points factually, and maintain a cordial but not overly enthusiastic tone.",
        "rejection": "Write a respectful, empathetic rejection. Be clear but kind, briefly explain if appropriate, and leave the relationship on good terms.",
        "follow_up": "Write a polite follow-up reply. Reference the original conversation, reiterate your key point or request, and create a gentle sense of urgency."
    }
    
    instruction = reply_instructions.get(reply_type, "Write a professional reply")
    
    prompt = f"""You are an expert at writing email replies that are contextually appropriate and professionally crafted.

REPLY TYPE: {reply_type}
INSTRUCTION: {instruction}

{f'ADDITIONAL CONTEXT: {additional_context}' if additional_context else ''}

RECEIVED EMAIL TO REPLY TO:
---
{received_email}
---

Write a complete, ready-to-send reply email. Include greeting and signature. Return ONLY the reply email:"""

    model = get_model(temperature=0.7)
    response = model.generate_content(prompt)
    return response.text


# ─── 6. EMAIL SUMMARIZER ──────────────────────────────────────────────────────

def summarize_email(email_thread: str) -> dict:
    """
    Summarize a long email thread into structured insights.
    
    Prompt Design:
    - We request STRUCTURED JSON output (not a paragraph)
    - We define exactly what categories to extract
    - Lower temperature for more factual, accurate extraction
    - Few-shot structure shows the AI the exact output format
    """
    
    prompt = f"""You are an expert at analyzing and summarizing email threads.

Analyze the following email thread and extract key information.

Return a JSON object with EXACTLY this structure:
{{
  "key_points": ["point 1", "point 2", "point 3"],
  "action_items": ["action 1", "action 2"],
  "important_dates": ["date/deadline 1", "date/deadline 2"],
  "summary": "A 2-3 sentence overall summary of the entire thread"
}}

Rules:
- key_points: Main topics/decisions discussed (3-7 points)
- action_items: Specific tasks that need to be done (can be empty list if none)
- important_dates: Any mentioned dates, deadlines, or timeframes (can be empty list if none)
- summary: Concise overview in plain language

Return ONLY the JSON object. No other text.

EMAIL THREAD:
---
{email_thread}
---

JSON output:"""

    model = get_model(temperature=0.3)  # Low temp for accurate extraction
    response = model.generate_content(prompt)
    
    try:
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())
    except json.JSONDecodeError:
        # Return a safe fallback structure
        return {
            "key_points": ["Could not parse structured data — raw summary below"],
            "action_items": [],
            "important_dates": [],
            "summary": response.text
        }


# ─── 7. TEMPLATE GENERATOR ────────────────────────────────────────────────────

TEMPLATES = {
    "internship_application": {
        "purpose": "Apply for a software engineering internship",
        "recipient": "Hiring Manager",
        "context": "Final-year CS student with web development and cloud skills",
        "tone": "professional"
    },
    "job_application": {
        "purpose": "Apply for a full-time software engineer position",
        "recipient": "Talent Acquisition Team",
        "context": "Recent CS graduate with project experience",
        "tone": "professional"
    },
    "leave_request": {
        "purpose": "Request approved leave/time off",
        "recipient": "Direct Manager",
        "context": "Requesting leave for personal reasons with advance notice",
        "tone": "formal"
    },
    "follow_up": {
        "purpose": "Follow up on a previous email or meeting that hasn't received a response",
        "recipient": "Previous email recipient",
        "context": "Gently reminding them and reiterating your request",
        "tone": "professional"
    },
    "networking": {
        "purpose": "Reach out to a professional for networking or mentorship",
        "recipient": "Industry professional or senior developer",
        "context": "Student interested in learning about their career and seeking advice",
        "tone": "friendly"
    },
    "client_communication": {
        "purpose": "Update a client on project status",
        "recipient": "Client",
        "context": "Providing a progress update with next steps",
        "tone": "professional"
    }
}


def get_template(template_type: str, custom_details: str = None) -> dict:
    """Return template defaults, optionally customized."""
    template = TEMPLATES.get(template_type)
    if not template:
        raise ValueError(f"Template '{template_type}' not found")
    
    result = template.copy()
    if custom_details:
        result["context"] = custom_details
    
    return result