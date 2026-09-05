from typing import Optional

import bcrypt
from fastapi import Depends, Request
from sqlmodel import Session, select

from app.database import get_session
from app.models import Role, User


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def get_current_user(request: Request, session: Session = Depends(get_session)) -> Optional[User]:
    """
    Reads the logged-in user's id out of the signed session cookie
    (set in routers/auth.py on login). Returns None if nobody is logged in -
    routes decide for themselves whether that's allowed.
    """
    user_id = request.session.get("user_id")
    if not user_id:
        return None
    return session.exec(select(User).where(User.id == user_id)).first()


def require_role(role: Role):
    """Dependency factory: 401/403 via PermissionError (see main.py's
    exception handler) if nobody is logged in or the wrong role is."""

    def _dep(user: Optional[User] = Depends(get_current_user)) -> User:
        if not user or user.role != role:
            raise PermissionError(f"{role.value.capitalize()} accounts only")
        return user

    return _dep
