from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.auth import get_current_user
from app.database import get_session
from app.models import AcademicOpportunity, Role, User

router = APIRouter(prefix="/api/academician")

def require_academician(user: User = Depends(get_current_user)) -> User:
    if not user or user.role != Role.academician:
        raise PermissionError("Academicians only")
    return user

@router.get("/dashboard")
def academician_dashboard(user: User = Depends(require_academician), session: Session = Depends(get_session)):
    opportunities = session.exec(select(AcademicOpportunity)).all()
    return {"opportunities": opportunities}
