from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlmodel import Session, select

from app.auth import hash_password, verify_password
from app.database import get_session
from app.models import Role, User

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Role
    skills: str = ""
    company_name: str = ""
    career_interest: str = ""


@router.post("/api/signup")
def api_signup(data: SignupRequest, request: Request, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == data.email)).first()
    if existing:
        return JSONResponse(status_code=400, content={"detail": "Email already registered"})
    user = User(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
        role=data.role,
        skills=data.skills,
        company_name=data.company_name,
        career_interest=data.career_interest,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    request.session["user_id"] = user.id
    return {"success": True, "user": {"id": user.id, "role": user.role, "name": user.name, "email": user.email}}


@router.post("/api/login")
def api_login(data: LoginRequest, request: Request, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data.email)).first()
    if not user or not verify_password(data.password, user.hashed_password):
        return JSONResponse(status_code=401, content={"detail": "Invalid email or password"})
    request.session["user_id"] = user.id
    return {"success": True, "user": {"id": user.id, "role": user.role, "name": user.name, "email": user.email}}


@router.post("/api/logout")
def api_logout(request: Request):
    request.session.clear()
    return {"success": True}


@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"success": True}

