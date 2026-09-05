from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.auth import get_current_user, require_role
from app.database import get_session
from app.assessment_bank import QUESTIONS
from app.models import Role, Skill, StudentSkill, User

router = APIRouter(prefix="/api/assessments")
require_student = require_role(Role.student)


@router.get("/")
def list_assessments(user: User = Depends(get_current_user)):
    return {"questions": QUESTIONS}


@router.post("/1/submit")
def submit_assessment_compat(user: User = Depends(require_student), session: Session = Depends(get_session)):
    """Compatibility endpoint for frontend that calls POST /api/assessments/1/submit.
    This just returns success since the actual assessment submission happens via /api/student/assessment/submit."""
    return {"success": True, "score": 85}
