from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_db_and_tables
from app.routers import auth_routes, industries, students, portfolio, assessments, academicians, institutions, learning

app = FastAPI(title="SkillBridge — Academia-Industry Collaboration Portal")

# Allow React app to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, secret_key="skillbridge-sih-26044-demo-key")

app.include_router(auth_routes.router)
app.include_router(students.router)
app.include_router(industries.router)
app.include_router(portfolio.router)
app.include_router(assessments.router)
app.include_router(academicians.router)
app.include_router(institutions.router)
app.include_router(learning.router)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
def root():
    return {"message": "SkillBridge API is running.", "version": "2.0"}


@app.get("/api/health")
def health_check():
    return {"ok": True}


@app.exception_handler(PermissionError)
def permission_denied(request: Request, exc: PermissionError):
    return JSONResponse(status_code=403, content={"detail": str(exc)})
