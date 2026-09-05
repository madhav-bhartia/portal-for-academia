"""
Explainable, deterministic matching engine.

No LLM, no randomness: the same (student, opportunity) pair always
produces the same score and the same explanation. This is intentional -
see the project brief's "AI USAGE" section. Every number returned here can
be read back to a judge as "this is exactly why".

Scoring:
    score = round(100 * (0.70 * required_component
                        + 0.20 * preferred_component
                        + 0.10 * interest_component))

  required_component / preferred_component (0.0-1.0):
    for each skill in that bucket, the student earns:
      - 1.0 credit  if their proficiency >= STRONG_THRESHOLD (they "have" it)
      - 0.5 credit  if their proficiency >= WEAK_THRESHOLD    (they're "weak" in it)
      - 0.0 credit  otherwise (missing)
    averaged across all skills in the bucket. A bucket with no skills
    defined is treated as fully satisfied (1.0) so it doesn't drag the
    score down for an opportunity that simply didn't specify any.

  interest_component (0.0 / 0.5 / 1.0):
    1.0 if the student's stated career interest text appears in the
    opportunity's title/type, 0.0 if they stated an interest that does NOT
    match, 0.5 (neutral) if they haven't stated an interest at all.

Known simplification (documented, not hidden): eligibility text and
project/experience history are shown to the reader but are NOT folded
into the numeric score in this MVP - see README "Known limitations".
"""
from typing import Optional

from sqlmodel import Session, select

from app.models import (
    Opportunity,
    OpportunitySkill,
    RequirementLevel,
    Skill,
    StudentSkill,
    User,
)

STRONG_THRESHOLD = 60  # proficiency >= this counts as "have the skill"
WEAK_THRESHOLD = 30    # proficiency in [WEAK, STRONG) counts as "weak"

REQUIRED_WEIGHT = 0.70
PREFERRED_WEIGHT = 0.20
INTEREST_WEIGHT = 0.10


def _student_skill_map(session: Session, student_id: int) -> dict[int, int]:
    rows = session.exec(
        select(StudentSkill).where(StudentSkill.student_id == student_id)
    ).all()
    return {r.skill_id: r.proficiency for r in rows}


def _opportunity_skills(session: Session, opportunity_id: int):
    rows = session.exec(
        select(OpportunitySkill, Skill)
        .where(OpportunitySkill.opportunity_id == opportunity_id)
        .where(OpportunitySkill.skill_id == Skill.id)
    ).all()
    required = [(os.skill_id, sk.name) for os, sk in rows if os.requirement == RequirementLevel.required]
    preferred = [(os.skill_id, sk.name) for os, sk in rows if os.requirement == RequirementLevel.preferred]
    return required, preferred


def _bucket_component(skill_list, prof_map: dict[int, int]):
    """Returns (component 0..1, matched[], weak[], missing[])."""
    if not skill_list:
        return 1.0, [], [], []
    matched, weak, missing = [], [], []
    credit_total = 0.0
    for skill_id, name in skill_list:
        prof = prof_map.get(skill_id, 0)
        if prof >= STRONG_THRESHOLD:
            matched.append(name)
            credit_total += 1.0
        elif prof >= WEAK_THRESHOLD:
            weak.append(name)
            credit_total += 0.5
        else:
            missing.append(name)
    component = credit_total / len(skill_list)
    return component, matched, weak, missing


def compute_match(session: Session, student: User, opportunity: Opportunity) -> dict:
    prof_map = _student_skill_map(session, student.id)
    required, preferred = _opportunity_skills(session, opportunity.id)

    req_component, req_matched, req_weak, req_missing = _bucket_component(required, prof_map)
    pref_component, pref_matched, pref_weak, pref_missing = _bucket_component(preferred, prof_map)

    interest = (student.career_interest or "").strip().lower()
    if not interest:
        interest_component = 0.5
        interest_note: Optional[str] = None
    else:
        haystack = f"{opportunity.title} {opportunity.type}".lower()
        if interest in haystack:
            interest_component = 1.0
            interest_note = f"Matches your stated interest in {student.career_interest}"
        else:
            interest_component = 0.0
            interest_note = None

    raw_score = (
        REQUIRED_WEIGHT * req_component
        + PREFERRED_WEIGHT * pref_component
        + INTEREST_WEIGHT * interest_component
    )
    score = round(100 * raw_score)

    reasons = []
    if req_matched:
        reasons.append(f"Matches your {', '.join(req_matched)} skills")
    if req_weak:
        reasons.append(f"Weak in {', '.join(req_weak)} (partial credit)")
    if req_missing:
        reasons.append(f"Missing required: {', '.join(req_missing)}")
    if pref_matched:
        reasons.append(f"Also has preferred skill(s): {', '.join(pref_matched)}")
    if interest_note:
        reasons.append(interest_note)
    if not reasons:
        reasons.append("No skill data yet - complete your skill assessment for a real match")

    return {
        "opportunity_id": opportunity.id,
        "score": max(0, min(100, score)),
        "required_matched": req_matched,
        "required_weak": req_weak,
        "required_missing": req_missing,
        "preferred_matched": pref_matched,
        "preferred_missing": pref_missing,
        "reasons": reasons,
    }


def rank_opportunities(session: Session, student: User, opportunities: list[Opportunity]) -> list[dict]:
    ranked = [
        {"opportunity": o, "match": compute_match(session, student, o)}
        for o in opportunities
    ]
    ranked.sort(key=lambda x: x["match"]["score"], reverse=True)
    return ranked


def rank_candidates(session: Session, opportunity: Opportunity, students: list[User]) -> list[dict]:
    ranked = [
        {"student": s, "match": compute_match(session, s, opportunity)}
        for s in students
    ]
    ranked.sort(key=lambda x: x["match"]["score"], reverse=True)
    return ranked
