"""
Every table the app uses lives here. Integrates original models with the
new skill-based models from the restructured codebase.
"""
from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import SQLModel, Field


class Role(str, Enum):
    student = "student"
    industry = "industry"
    academician = "academician"
    institution = "institution"


class RequirementLevel(str, Enum):
    required = "required"
    preferred = "preferred"


class ApplicationStatus(str, Enum):
    applied = "applied"
    shortlisted = "shortlisted"
    rejected = "rejected"
    hired = "hired"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: Role

    # Student-only fields
    skills: str = ""            # comma-separated legacy field
    bio: str = ""
    career_interest: str = ""   # e.g. "data analyst", "full-stack"

    # Industry-only fields
    company_name: str = ""

    # Institution link for students
    institution_id: Optional[int] = Field(default=None, foreign_key="user.id")


# ── Skill system (new) ──────────────────────────────────────────────

class Skill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    category: str = ""  # "technical" or "soft"


class StudentSkill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="user.id")
    skill_id: int = Field(foreign_key="skill.id")
    proficiency: int = 0  # 0-100


# ── Opportunities (new unified model) ───────────────────────────────

class Opportunity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    industry_id: int = Field(foreign_key="user.id")
    title: str
    description: str = ""
    type: str = "internship"  # internship, job, project, apprenticeship
    location: str = ""
    work_mode: str = ""       # remote, hybrid, on-site
    duration: str = ""
    stipend: str = ""
    eligibility: str = ""
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)


class OpportunitySkill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    opportunity_id: int = Field(foreign_key="opportunity.id")
    skill_id: int = Field(foreign_key="skill.id")
    requirement: RequirementLevel = RequirementLevel.required


class Application(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="user.id")
    opportunity_id: int = Field(foreign_key="opportunity.id")
    status: ApplicationStatus = ApplicationStatus.applied
    applied_at: datetime = Field(default_factory=datetime.utcnow)


# ── Learning / Courses (new) ────────────────────────────────────────

class Course(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    industry_id: Optional[int] = Field(default=None, foreign_key="user.id")
    title: str
    description: str = ""
    provider: str = ""
    skills_covered: str = ""  # comma-separated skill names
    link: str = ""
    duration: str = ""


class StudentCourse(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="user.id")
    course_id: int = Field(foreign_key="course.id")
    completed_at: datetime = Field(default_factory=datetime.utcnow)


# ── Hiring records (for insights) ───────────────────────────────────

class HiringRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    industry_id: int = Field(foreign_key="user.id")
    role_title: str
    skills_demonstrated: str = ""   # comma-separated
    courses_completed: str = ""     # comma-separated


# ── Portfolio ────────────────────────────────────────────────────────

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="user.id")
    title: str
    description: str = ""
    link: str = ""


class Certificate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="user.id")
    title: str
    issuer: str = ""
    issue_date: datetime = Field(default_factory=datetime.utcnow)


# ── Legacy models (kept for backward compat) ────────────────────────

class Internship(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    industry_id: int = Field(foreign_key="user.id")
    title: str
    description: str = ""
    required_skills: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    industry_id: int = Field(foreign_key="user.id")
    title: str
    description: str = ""
    required_skills: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AcademicOpportunityType(str, Enum):
    fdp = "fdp"
    research = "research"
    industrial_training = "industrial_training"
    consultancy = "consultancy"


class AcademicOpportunity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="user.id")
    type: AcademicOpportunityType
    title: str
    description: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TrainingProgram(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    industry_id: int = Field(foreign_key="user.id")
    title: str
    description: str = ""
    skills_covered: str = ""
    link: str = ""


class Assessment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str = ""
    skill_category: str = ""


class AssessmentResult(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="user.id")
    assessment_id: int = Field(foreign_key="assessment.id")
    score: int
    taken_at: datetime = Field(default_factory=datetime.utcnow)
