from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from pydantic import BaseModel
from app.auth import get_current_user
from app.database import get_session
from app.models import Job, Role, User
from app.matching import match_score

router = APIRouter(prefix="/api/jobs")

def require_industry(user: User = Depends(get_current_user)) -> User:
    if not user or user.role != Role.industry:
        raise PermissionError("Industry accounts only")
    return user

@router.get("/")
def job_board(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    jobs = session.exec(select(Job)).all()
    
    if user and user.role == Role.student:
        ranked = sorted(
            ({"job": j, "score": match_score(user.skills, j.required_skills)} for j in jobs),
            key=lambda x: x["score"],
            reverse=True,
        )
        return {"ranked_jobs": ranked}
    return {"jobs": jobs}

class JobRequest(BaseModel):
    title: str
    description: str = ""
    required_skills: str = ""

@router.post("/post")
def post_job(data: JobRequest, user: User = Depends(require_industry), session: Session = Depends(get_session)):
    job = Job(industry_id=user.id, title=data.title, description=data.description, required_skills=data.required_skills)
    session.add(job)
    session.commit()
    return {"success": True}
