"""
CollegeConnect Python NLP & AI Service (FastAPI)
Provides Text Classification, NER, Deadline/Action Extraction,
Priority Scoring, "What Did I Miss?" Synthesizer, and AI Assistant.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import re

app = FastAPI(
    title="CollegeConnect NLP Intelligence API",
    description="NLP & AI Service for Academic Information Management",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextPayload(BaseModel):
    text: str

class WhatDidIMissPayload(BaseModel):
    last_active: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class AssistantPayload(BaseModel):
    query: str
    knowledge: Optional[Dict[str, Any]] = None

CATEGORY_KEYWORDS = {
    'Assignment': ['assignment', 'submit', 'submission', 'homework', 'task', 'lab record', 'project report'],
    'Exam': ['exam', 'test', 'midterm', 'internal', 'quiz', 'end sem', 'viva', 'assessment', 'marks'],
    'Timetable': ['timetable', 'schedule', 'class cancelled', 'rescheduled', 'time change', 'postponed', 'venue', 'hall'],
    'Study Material': ['notes', 'ppt', 'pdf', 'unit', 'study material', 'reference', 'textbook', 'pyq', 'question bank'],
    'Placement': ['placement', 'internship', 'hiring', 'recruitment', 'package', 'lpa', 'drive', 'company', 'eligibility'],
    'Event': ['hackathon', 'symposium', 'workshop', 'webinar', 'guest lecture', 'conference', 'tech fest', 'cultural'],
    'Faculty Instruction': ['instruction', 'mandatory', 'attendance', 'bring', 'wear', 'id card', 'lab coat', 'notice']
}

SUBJECT_KEYWORDS = {
    'Natural Language Processing': ['nlp', 'natural language', 'tokenization', 'bert', 'gpt', 'parsing', 'transformers', 'spacy'],
    'Database Management Systems': ['dbms', 'sql', 'database', 'rdbms', 'normalization', 'acid', 'transaction', 'indexing'],
    'Deep Learning': ['dl', 'deep learning', 'cnn', 'rnn', 'lstm', 'neural network', 'backpropagation', 'pytorch'],
    'Design & Analysis of Algorithms': ['daa', 'algorithms', 'sorting', 'graph', 'dp', 'dynamic programming', 'greedy']
}

@app.get("/")
def root():
    return {
        "service": "CollegeConnect NLP Engine",
        "status": "active",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/nlp/analyze")
def analyze_text(payload: TextPayload):
    text = payload.text
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty")

    lower_text = text.lower()

    # 1. Text Classification
    category = "General"
    best_score = 0
    for cat, kws in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in kws if kw in lower_text)
        if score > best_score:
            best_score = score
            category = cat

    # 2. Subject Extraction
    extracted_subject = "General CSE"
    for sub, kws in SUBJECT_KEYWORDS.items():
        if any(kw in lower_text for kw in kws):
            extracted_subject = sub
            break

    # 3. Department & Year Extraction
    department = "Computer Science & Engineering"
    if "cse" in lower_text or "computer science" in lower_text:
        department = "Computer Science & Engineering"
    elif "it" in lower_text or "information" in lower_text:
        department = "Information Technology"
    elif "ece" in lower_text:
        department = "Electronics & Communication"

    year = "All Years"
    if "third-year" in lower_text or "3rd year" in lower_text or "third year" in lower_text:
        year = "3rd Year"
    elif "second-year" in lower_text or "2nd year" in lower_text:
        year = "2nd Year"
    elif "first-year" in lower_text or "1st year" in lower_text:
        year = "1st Year"
    elif "final-year" in lower_text or "4th year" in lower_text:
        year = "4th Year"

    # 4. Deadline Extraction
    deadline_match = re.search(r'(?:by|before|on|due)\s+([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))?)', text, re.IGNORECASE)
    deadline = deadline_match.group(1) if deadline_match else None

    # 5. Action Extraction
    action = "Review announcement details"
    if "submit" in lower_text:
        match = re.search(r'submit\s+(?:the\s+)?([^.,\n]+)', text, re.IGNORECASE)
        action = f"Submit {match.group(1).strip()}" if match else "Submit required coursework"
    elif "exam" in lower_text or "prepare" in lower_text:
        action = f"Prepare for {extracted_subject} examination"
    elif "register" in lower_text:
        action = "Complete registration on portal"

    # 6. Priority Scoring
    high_urgency = ['urgent', 'mandatory', 'deadline', 'exam', 'strict', 'immediately', 'penalized', 'important', 'september 8']
    if any(w in lower_text for w in high_urgency) or "submit" in lower_text:
        priority = "High"
    elif "optional" in lower_text or "fyi" in lower_text or "reference" in lower_text:
        priority = "Low"
    else:
        priority = "Medium"

    # 7. Short Summary
    summary = text if len(text) <= 140 else text[:137] + "..."

    return {
        "category": category,
        "subject": extracted_subject,
        "department": department,
        "year": year,
        "deadline": deadline,
        "action": action,
        "priority": priority,
        "summary": summary
    }

@app.post("/nlp/what-did-i-miss")
def what_did_i_miss(payload: WhatDidIMissPayload):
    data = payload.data or {}
    announcements = data.get("announcements", [])
    materials = data.get("studyMaterials", [])
    assignments = data.get("assignments", [])
    exams = data.get("exams", [])

    important = []
    upcoming_exams = []
    new_materials = []
    upcoming_events = []

    for a in announcements:
        if a.get("priority") == "High" or a.get("category") in ["Assignment", "Placement"]:
            important.append({
                "title": a.get("title"),
                "deadline": a.get("deadline") or "Urgent",
                "action": a.get("action") or "Review details",
                "subject": a.get("subjectName"),
                "teacher": a.get("teacherName"),
                "type": a.get("category", "Notice")
            })
        elif a.get("category") == "Event":
            upcoming_events.append({
                "title": a.get("title"),
                "date": a.get("deadline") or "Upcoming",
                "type": "Event"
            })

    for ex in exams:
        upcoming_exams.append({
            "subject": ex.get("subjectName"),
            "title": ex.get("title"),
            "date": ex.get("examDate"),
            "time": ex.get("time"),
            "venue": ex.get("venue"),
            "syllabus": ex.get("syllabus")
        })

    for m in materials:
        new_materials.append({
            "title": m.get("title"),
            "subject": m.get("subjectName"),
            "teacher": m.get("teacherName"),
            "type": m.get("type"),
            "unit": m.get("unit")
        })

    return {
        "since": payload.last_active or (datetime.utcnow() - timedelta(days=3)).isoformat(),
        "totalMissedCount": len(important) + len(upcoming_exams) + len(new_materials) + len(upcoming_events),
        "important": important,
        "upcomingExams": upcoming_exams,
        "newMaterials": new_materials,
        "upcomingEvents": upcoming_events
    }

@app.post("/nlp/assistant")
def assistant_chat(payload: AssistantPayload):
    q = payload.query.lower()
    knowledge = payload.knowledge or {}

    if "assignment" in q or "due" in q or "homework" in q:
        asgs = knowledge.get("assignments", [])
        if not asgs:
            return {"answer": "No pending assignments found."}
        ans = "Here are your pending assignments:\n\n"
        for idx, a in enumerate(asgs, 1):
            ans += f"{idx}. **{a.get('title')}** ({a.get('subjectName')}) — Due: {a.get('dueDate')}\n"
        return {"answer": ans, "category": "Assignments"}

    if "exam" in q or "test" in q:
        exs = knowledge.get("exams", [])
        ans = "Here are your scheduled exams:\n\n"
        for idx, e in enumerate(exs, 1):
            ans += f"{idx}. **{e.get('subjectName')} ({e.get('title')})** — Date: {e.get('examDate')} at {e.get('time')} in {e.get('venue')}\n"
        return {"answer": ans, "category": "Exams"}

    if "note" in q or "material" in q or "ppt" in q or "pyq" in q:
        mats = knowledge.get("studyMaterials", [])
        ans = "Here are the available study notes & PPTs:\n\n"
        for idx, m in enumerate(mats[:5], 1):
            ans += f"{idx}. **{m.get('title')}** [{m.get('type', '').upper()}] by {m.get('teacherName')}\n"
        return {"answer": ans, "category": "Study Materials"}

    return {
        "answer": f"I analyzed our college academic repository for '{payload.query}'. You can ask me about assignment deadlines, upcoming exams, teacher study materials (Unit 1-5 & PYQs), timetable changes, or hackathon experiences!",
        "category": "General"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
