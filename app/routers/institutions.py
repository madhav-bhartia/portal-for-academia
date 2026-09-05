from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.auth import require_role
from app.database import get_session
from app.analytics import institution_dashboard_data, skill_demand_vs_supply
from app.models import Role, User

router = APIRouter(prefix="/api/institution")
require_institution = require_role(Role.institution)


@router.get("/dashboard")
def institution_dashboard(user: User = Depends(require_institution), session: Session = Depends(get_session)):
    data = institution_dashboard_data(session, user)
    return data


@router.get("/demand-supply")
def demand_supply(user: User = Depends(require_institution), session: Session = Depends(get_session)):
    data = skill_demand_vs_supply(session)
    return {"skills": data}
