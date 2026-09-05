from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Optional, List

from app.auth import get_current_user, require_role
from app.database import get_session
from app.matching import compute_match, rank_opportunities
from app.assessment_bank import QUESTIONS
from app.models import (
    Application, Opportunity, Role, Skill, StudentSkill, User,
    Project, Certificate, Course, StudentCourse,
)

router = APIRouter(prefix="/api/student")
require_student = require_role(Role.student)


@router.get("/dashboard")
def student_dashboard(user: User = Depends(require_student), session: Session = Depends(get_session)):
    # Skill profile
    skill_rows = session.exec(select(StudentSkill, Skill).where(StudentSkill.student_id == user.id).where(StudentSkill.skill_id == Skill.id)).all()
    skills = [{"name": sk.name, "category": sk.category, "proficiency": ss.proficiency} for ss, sk in skill_rows]
    
    # Opportunities with match scores
    opportunities = session.exec(select(Opportunity).where(Opportunity.is_active == True)).all()
    ranked = rank_opportunities(session, user, opportunities)
    ranked_data = []
    for item in ranked:
        o = item["opportunity"]
        m = item["match"]
        ranked_data.append({
            "opportunity": {"id": o.id, "title": o.title, "description": o.description, "type": o.type, "stipend": o.stipend, "location": o.location, "work_mode": o.work_mode},
            "match": m,
        })
    
    # Applications
    apps = session.exec(select(Application).where(Application.student_id == user.id)).all()
    applied_ids = [a.opportunity_id for a in apps]
    app_statuses = [{"opportunity_id": a.opportunity_id, "status": a.status} for a in apps]
    
    # Portfolio
    projects = session.exec(select(Project).where(Project.student_id == user.id)).all()
    certificates = session.exec(select(Certificate).where(Certificate.student_id == user.id)).all()
    
    return {
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "career_interest": user.career_interest},
        "skills": skills,
        "ranked_opportunities": ranked_data,
        "applied_ids": applied_ids,
        "applications": app_statuses,
        "projects": [{"id": p.id, "title": p.title, "description": p.description, "link": p.link} for p in projects],
        "certificates": [{"id": c.id, "title": c.title, "issuer": c.issuer} for c in certificates],
    }


@router.get("/skills")
def get_skills(user: User = Depends(require_student), session: Session = Depends(get_session)):
    rows = session.exec(select(StudentSkill, Skill).where(StudentSkill.student_id == user.id).where(StudentSkill.skill_id == Skill.id)).all()
    return {"skills": [{"name": sk.name, "category": sk.category, "proficiency": ss.proficiency} for ss, sk in rows]}


class AssessmentSubmission(BaseModel):
    answers: dict  # {"python": 2, "sql": 1, ...} index into options


@router.post("/assessment/submit")
def submit_assessment(data: AssessmentSubmission, user: User = Depends(require_student), session: Session = Depends(get_session)):
    """Deterministic skill assessment: each answer maps to a fixed proficiency value."""
    results = []
    for q in QUESTIONS:
        answer_idx = data.answers.get(q["id"])
        if answer_idx is None:
            continue
        try:
            answer_idx = int(answer_idx)
        except (ValueError, TypeError):
            continue
        if 0 <= answer_idx < len(q["options"]):
            proficiency = q["options"][answer_idx]["value"]
            skill = session.exec(select(Skill).where(Skill.name == q["skill"])).first()
            if skill:
                existing = session.exec(
                    select(StudentSkill)
                    .where(StudentSkill.student_id == user.id)
                    .where(StudentSkill.skill_id == skill.id)
                ).first()
                if existing:
                    existing.proficiency = proficiency
                    session.add(existing)
                else:
                    session.add(StudentSkill(student_id=user.id, skill_id=skill.id, proficiency=proficiency))
                results.append({"skill": q["skill"], "proficiency": proficiency})
    session.commit()
    return {"success": True, "results": results}


@router.get("/assessment/questions")
def get_assessment_questions(user: User = Depends(require_student)):
    return {"questions": QUESTIONS}


@router.post("/apply/{opportunity_id}")
def apply_to_opportunity(opportunity_id: int, user: User = Depends(require_student), session: Session = Depends(get_session)):
    existing = session.exec(
        select(Application)
        .where(Application.student_id == user.id)
        .where(Application.opportunity_id == opportunity_id)
    ).first()
    if not existing:
        session.add(Application(student_id=user.id, opportunity_id=opportunity_id))
        session.commit()
    return {"success": True}
