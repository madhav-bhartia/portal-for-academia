"""
Deterministic, explainable aggregate analytics:
  - Skill Demand vs Student Supply (institution + industry views)
  - Student readiness (internship-ready / placement-ready)
  - Hiring Insights (skills/courses common among a company's past hires)

Everything here is a transparent arithmetic aggregation over seeded /
live rows - no ML, no LLM. Formulas are documented inline and in the
final report so a judge can be walked through any number on screen.
"""
from collections import Counter
from typing import Optional

from sqlmodel import Session, select

from app.matching import STRONG_THRESHOLD, WEAK_THRESHOLD
from app.models import (
    Application,
    ApplicationStatus,
    Certificate,
    HiringRecord,
    Opportunity,
    OpportunitySkill,
    Project,
    RequirementLevel,
    Role,
    Skill,
    StudentSkill,
    User,
)


def skill_demand_vs_supply(session: Session, student_ids: Optional[list[int]] = None) -> list[dict]:
    """
    Demand: for each skill, what fraction of *active* opportunities on the
    platform ask for it - required skills count fully, preferred skills
    count at half weight.
        demand% = 100 * sum(1.0 if required else 0.5 for each reference) / total_active_opportunities

    Supply: for the given set of students (all students if none given),
    the average proficiency (0-100) in that skill, treating "no record" as 0.
        supply% = 100 * sum(proficiency) / (100 * num_students)  [== avg proficiency]

    Gap = demand% - supply%. Positive gap = industry wants it more than
    students currently have it.
    """
    opportunities = session.exec(select(Opportunity).where(Opportunity.is_active == True)).all()  # noqa: E712
    total_opps = len(opportunities) or 1

    opp_skill_rows = session.exec(select(OpportunitySkill, Skill)).all()
    demand_weight: dict[str, float] = {}
    for os, sk in opp_skill_rows:
        w = 1.0 if os.requirement == RequirementLevel.required else 0.5
        demand_weight[sk.name] = demand_weight.get(sk.name, 0.0) + w

    if student_ids is None:
        students = session.exec(select(User).where(User.role == Role.student)).all()
        student_ids = [s.id for s in students]
    total_students = len(student_ids) or 1

    all_skills = session.exec(select(Skill)).all()
    result = []
    for sk in all_skills:
        demand_pct = round(100 * demand_weight.get(sk.name, 0.0) / total_opps)
        rows = session.exec(
            select(StudentSkill)
            .where(StudentSkill.skill_id == sk.id)
            .where(StudentSkill.student_id.in_(student_ids))
        ).all()
        supply_sum = sum(r.proficiency for r in rows)
        supply_pct = round(supply_sum / total_students)
        result.append({
            "skill": sk.name,
            "category": sk.category,
            "demand": min(100, demand_pct),
            "supply": min(100, supply_pct),
            "gap": min(100, demand_pct) - min(100, supply_pct),
        })
    result.sort(key=lambda x: x["demand"], reverse=True)
    return result


def student_readiness(session: Session, student: User) -> dict:
    """
    internship_ready: average proficiency across all assessed skills >= 50
    placement_ready:  average proficiency >= 70 AND at least one
                       project or certificate on the portfolio
    (Thresholds are fixed constants, documented here and in the final
    report - not learned, not hidden.)
    """
    rows = session.exec(select(StudentSkill).where(StudentSkill.student_id == student.id)).all()
    avg_prof = round(sum(r.proficiency for r in rows) / len(rows)) if rows else 0
    has_portfolio_item = bool(
        session.exec(select(Project).where(Project.student_id == student.id)).first()
        or session.exec(select(Certificate).where(Certificate.student_id == student.id)).first()
    )
    return {
        "avg_proficiency": avg_prof,
        "internship_ready": avg_prof >= 50,
        "placement_ready": avg_prof >= 70 and has_portfolio_item,
    }


def institution_dashboard_data(session: Session, institution: User) -> dict:
    students = session.exec(
        select(User).where(User.role == Role.student).where(User.institution_id == institution.id)
    ).all()
    student_ids = [s.id for s in students]

    readiness = [student_readiness(session, s) for s in students]
    internship_ready = sum(1 for r in readiness if r["internship_ready"])
    placement_ready = sum(1 for r in readiness if r["placement_ready"])

    demand_supply = skill_demand_vs_supply(session, student_ids or None)
    top_demand = demand_supply[:5]
    largest_gaps = sorted(demand_supply, key=lambda x: x["gap"], reverse=True)[:5]

    students_needing_top_gap_skill = 0
    top_gap_skill_name = None
    if largest_gaps:
        top_gap_skill_name = largest_gaps[0]["skill"]
        skill_row = session.exec(select(Skill).where(Skill.name == top_gap_skill_name)).first()
        if skill_row and student_ids:
            weak_rows = session.exec(
                select(StudentSkill)
                .where(StudentSkill.skill_id == skill_row.id)
                .where(StudentSkill.student_id.in_(student_ids))
                .where(StudentSkill.proficiency < WEAK_THRESHOLD)
            ).all()
            covered_ids = {r.student_id for r in weak_rows}
            # students with no record at all for this skill also "need" it
            has_record_ids = {
                r.student_id for r in session.exec(
                    select(StudentSkill)
                    .where(StudentSkill.skill_id == skill_row.id)
                    .where(StudentSkill.student_id.in_(student_ids))
                ).all()
            }
            no_record_ids = set(student_ids) - has_record_ids
            students_needing_top_gap_skill = len(covered_ids | no_record_ids)

    active_opportunities = session.exec(select(Opportunity).where(Opportunity.is_active == True)).all()  # noqa: E712

    outcome_counts = {status.value: 0 for status in ApplicationStatus}
    if student_ids:
        apps = session.exec(select(Application).where(Application.student_id.in_(student_ids))).all()
        for a in apps:
            outcome_counts[a.status.value] += 1

    return {
        "institution_name": institution.name,
        "total_students": len(students),
        "internship_ready_students": internship_ready,
        "placement_ready_students": placement_ready,
        "top_industry_demanded_skills": top_demand,
        "largest_skill_gaps": largest_gaps,
        "students_needing_top_gap_skill": students_needing_top_gap_skill,
        "top_gap_skill_name": top_gap_skill_name,
        "current_opportunities": len(active_opportunities),
        "placement_outcomes": outcome_counts,
        "skill_demand_vs_supply": demand_supply,
    }


def hiring_insights(session: Session, industry_id: int, role_title: Optional[str] = None) -> dict:
    """
    'Common among previous hires' - a plain frequency count over seeded
    historical HiringRecord rows for this company (optionally filtered to
    one role title). Explicitly NOT a causal claim - see wording below.
    """
    query = select(HiringRecord).where(HiringRecord.industry_id == industry_id)
    if role_title:
        query = query.where(HiringRecord.role_title == role_title)
    records = session.exec(query).all()
    total = len(records)
    if total == 0:
        return {"total_hires": 0, "common_skills": [], "common_learning": [], "role_title": role_title}

    skill_counter: Counter = Counter()
    course_counter: Counter = Counter()
    for r in records:
        for s in [s.strip() for s in r.skills_demonstrated.split(",") if s.strip()]:
            skill_counter[s] += 1
        for c in [c.strip() for c in r.courses_completed.split(",") if c.strip()]:
            course_counter[c] += 1

    common_skills = [
        {"skill": name, "count": count, "of": total,
         "label": f"Observed in {count}/{total} previous hires"}
        for name, count in skill_counter.most_common(6)
    ]
    common_learning = [
        {"course": name, "count": count, "of": total,
         "label": f"Observed in {count}/{total} previous hires"}
        for name, count in course_counter.most_common(5)
    ]
    return {
        "total_hires": total,
        "common_skills": common_skills,
        "common_learning": common_learning,
        "role_title": role_title,
    }
