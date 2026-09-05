from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from pydantic import BaseModel
from datetime import datetime
from app.auth import get_current_user
from app.database import get_session
from app.models import Project, Certificate, Role, User

router = APIRouter(prefix="/api/portfolio")

def require_student(user: User = Depends(get_current_user)) -> User:
    if not user or user.role != Role.student:
        raise PermissionError("Students only")
    return user

@router.get("/")
def view_portfolio(user: User = Depends(require_student), session: Session = Depends(get_session)):
    projects = session.exec(select(Project).where(Project.student_id == user.id)).all()
    certificates = session.exec(select(Certificate).where(Certificate.student_id == user.id)).all()
    return {"projects": projects, "certificates": certificates}

class ProjectRequest(BaseModel):
    title: str
    description: str = ""
    link: str = ""

@router.post("/project/add")
def add_project(data: ProjectRequest, user: User = Depends(require_student), session: Session = Depends(get_session)):
    project = Project(student_id=user.id, title=data.title, description=data.description, link=data.link)
    session.add(project)
    session.commit()
    return {"success": True}

class CertificateRequest(BaseModel):
    title: str
    issuer: str
    issue_date: str

@router.post("/certificate/add")
def add_certificate(data: CertificateRequest, user: User = Depends(require_student), session: Session = Depends(get_session)):
    try:
        dt = datetime.strptime(data.issue_date, "%Y-%m-%d")
    except ValueError:
        dt = datetime.utcnow()
    cert = Certificate(student_id=user.id, title=data.title, issuer=data.issuer, issue_date=dt)
    session.add(cert)
    session.commit()
    return {"success": True}
