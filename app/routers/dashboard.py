from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse

from app.auth import get_current_user
from app.models import Role, User

router = APIRouter()


@router.get("/dashboard")
def dashboard(request: Request, user: User = Depends(get_current_user)):
    """
    Single entry point that sends each role to its own dashboard.
    Keeping this as one route (instead of guessing the URL client-side)
    means the login redirect never needs to know about roles.
    """
    if not user:
        return RedirectResponse(url="/login", status_code=303)

    destinations = {
        Role.student: "/student/dashboard",
        Role.industry: "/industry/dashboard",
        Role.academician: "/academician/dashboard",
        Role.institution: "/institution/dashboard",
    }
    return RedirectResponse(url=destinations[user.role], status_code=303)
