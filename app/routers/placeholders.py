from fastapi import APIRouter, Depends, Request
from fastapi.templating import Jinja2Templates

from app.auth import get_current_user
from app.models import User

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/academician/dashboard")
def academician_dashboard(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(
        request, "coming_soon.html", {"user": user, "area": "Academician"}
    )


@router.get("/institution/dashboard")
def institution_dashboard(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(
        request, "coming_soon.html", {"user": user, "area": "Institution"}
    )
