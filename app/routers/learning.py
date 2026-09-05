from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session, select

from app.auth import require_role, get_current_user
from app.database import get_session
from app.matching import compute_match
from app.models import Course, Opportunity, Role, Skill, StudentCourse, StudentSkill, User

router = APIRouter(prefix="/api/learning")
require_student = require_role(Role.student)
require_industry = require_role(Role.industry)


@router.get("/")
def list_programs(session: Session = Depends(get_session)):
    programs = session.exec(select(Course)).all()
    return {"programs": [{"id": p.id, "title": p.title, "description": p.description, "provider": p.provider, "skills_covered": p.skills_covered, "link": p.link, "duration": p.duration} for p in programs]}


class ProgramRequest(BaseModel):
    title: str
    description: str = ""
    provider: str = ""
    skills_covered: str = ""
    link: str = ""
    duration: str = ""


@router.post("/post")
def post_program(data: ProgramRequest, user: User = Depends(require_industry), session: Session = Depends(get_session)):
    program = Course(
        industry_id=user.id,
        title=data.title,
        description=data.description,
        provider=data.provider,
        skills_covered=data.skills_covered,
        link=data.link,
        duration=data.duration,
    )
    session.add(program)
    session.commit()
    return {"success": True}


@router.get("/recommend")
def recommend_learning(
    opportunity_id: int, user: User = Depends(require_student), session: Session = Depends(get_session)
):
    opportunity = session.get(Opportunity, opportunity_id)
    if not opportunity:
        return {"error": "Not found"}
    match = compute_match(session, user, opportunity)
    gap_skills = [s.lower() for s in (match["required_missing"] + match.get("required_weak", []))]
    if not gap_skills:
        return {"gap_skills": [], "recommendations": []}

    courses = session.exec(select(Course)).all()
    recommendations = []
    for c in courses:
        covered = [s.strip().lower() for s in c.skills_covered.split(",") if s.strip()]
        overlap = [s for s in covered if s in gap_skills]
        if overlap:
            overlap_display = [s.title() for s in overlap]
            recommendations.append({
                "course": {"id": c.id, "title": c.title, "description": c.description, "provider": c.provider, "link": c.link},
                "covers_gap_skills": overlap_display,
                "reason": f"Covers {', '.join(overlap_display)}, which you're missing for this role",
            })
    recommendations.sort(key=lambda r: len(r["covers_gap_skills"]), reverse=True)
    return {"gap_skills": [s.title() for s in gap_skills], "recommendations": recommendations}


@router.post("/{course_id}/complete")
def complete_course(course_id: int, user: User = Depends(require_student), session: Session = Depends(get_session)):
    course = session.get(Course, course_id)
    if not course:
        return {"error": "Not found"}
    existing = session.exec(
        select(StudentCourse)
        .where(StudentCourse.student_id == user.id)
        .where(StudentCourse.course_id == course_id)
    ).first()
    if not existing:
        session.add(StudentCourse(student_id=user.id, course_id=course_id))
        session.commit()
    covered_names = [s.strip() for s in course.skills_covered.split(",") if s.strip()]
    for name in covered_names:
        skill = session.exec(select(Skill).where(Skill.name.ilike(name))).first()
        if not skill:
            continue
        ss = session.exec(
            select(StudentSkill)
            .where(StudentSkill.student_id == user.id)
            .where(StudentSkill.skill_id == skill.id)
        ).first()
        if ss:
            ss.proficiency = min(100, ss.proficiency + 25)
            session.add(ss)
        else:
            session.add(StudentSkill(student_id=user.id, skill_id=skill.id, proficiency=25))
    session.commit()
    return {"success": True}
