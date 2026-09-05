from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Optional, List

from app.auth import require_role
from app.database import get_session
from app.matching import rank_candidates
from app.analytics import hiring_insights
from app.models import (
    Application, ApplicationStatus, Opportunity, OpportunitySkill,
    RequirementLevel, Role, Skill, User,
)

router = APIRouter(prefix="/api/industry")
require_industry = require_role(Role.industry)


@router.get("/dashboard")
def industry_dashboard(user: User = Depends(require_industry), session: Session = Depends(get_session)):
    opportunities = session.exec(select(Opportunity).where(Opportunity.industry_id == user.id)).all()
    opp_data = []
    for o in opportunities:
        apps = session.exec(
            select(Application, User)
            .where(Application.opportunity_id == o.id)
            .where(Application.student_id == User.id)
        ).all()
        applicants = []
        for app, student in apps:
            applicants.append({
                "application_id": app.id,
                "student": {"id": student.id, "name": student.name, "email": student.email},
                "status": app.status,
            })
        opp_data.append({
            "opportunity": {"id": o.id, "title": o.title, "type": o.type, "is_active": o.is_active, "description": o.description},
            "applicant_count": len(applicants),
            "applicants": applicants,
        })
    return {"user": {"id": user.id, "name": user.name, "company_name": user.company_name}, "opportunities": opp_data}


class PostOpportunityRequest(BaseModel):
    title: str
    description: str = ""
    type: str = "internship"
    required_skills: str = ""  # comma-separated
    preferred_skills: str = ""
    stipend: str = ""
    location: str = ""
    work_mode: str = ""
    duration: str = ""
    eligibility: str = ""


@router.post("/post")
def post_opportunity(data: PostOpportunityRequest, user: User = Depends(require_industry), session: Session = Depends(get_session)):
    opp = Opportunity(
        industry_id=user.id,
        title=data.title,
        description=data.description,
        type=data.type,
        stipend=data.stipend,
        location=data.location,
        work_mode=data.work_mode,
        duration=data.duration,
        eligibility=data.eligibility,
    )
    session.add(opp)
    session.commit()
    session.refresh(opp)
    
    # Link required skills
    for skill_name in [s.strip() for s in data.required_skills.split(",") if s.strip()]:
        skill = session.exec(select(Skill).where(Skill.name.ilike(skill_name))).first()
        if not skill:
            skill = Skill(name=skill_name, category="technical")
            session.add(skill)
            session.commit()
            session.refresh(skill)
        session.add(OpportunitySkill(opportunity_id=opp.id, skill_id=skill.id, requirement=RequirementLevel.required))
    
    # Link preferred skills
    for skill_name in [s.strip() for s in data.preferred_skills.split(",") if s.strip()]:
        skill = session.exec(select(Skill).where(Skill.name.ilike(skill_name))).first()
        if not skill:
            skill = Skill(name=skill_name, category="technical")
            session.add(skill)
            session.commit()
            session.refresh(skill)
        session.add(OpportunitySkill(opportunity_id=opp.id, skill_id=skill.id, requirement=RequirementLevel.preferred))
    
    session.commit()
    return {"success": True}


@router.get("/candidates/{opportunity_id}")
def get_candidates(opportunity_id: int, user: User = Depends(require_industry), session: Session = Depends(get_session)):
    opportunity = session.get(Opportunity, opportunity_id)
    if not opportunity or opportunity.industry_id != user.id:
        return {"error": "Not found"}
    students = session.exec(select(User).where(User.role == Role.student)).all()
    ranked = rank_candidates(session, opportunity, students)
    return {
        "opportunity": {"id": opportunity.id, "title": opportunity.title},
        "candidates": [
            {
                "student": {"id": r["student"].id, "name": r["student"].name, "email": r["student"].email},
                "match": r["match"],
            }
            for r in ranked
        ],
    }


class UpdateStatusRequest(BaseModel):
    status: ApplicationStatus


@router.post("/applications/{application_id}/status")
def update_status(application_id: int, data: UpdateStatusRequest, user: User = Depends(require_industry), session: Session = Depends(get_session)):
    application = session.get(Application, application_id)
    if application:
        application.status = data.status
        session.add(application)
        session.commit()
    return {"success": True}


@router.get("/hiring-insights")
def get_hiring_insights(role_title: Optional[str] = None, user: User = Depends(require_industry), session: Session = Depends(get_session)):
    insights = hiring_insights(session, user.id, role_title)
    return insights
