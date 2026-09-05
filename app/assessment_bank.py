"""
Fixed, deterministic skill-assessment question bank.

Deliberately NOT database-driven and NOT LLM-scored: the same set of
answers must always produce the same skill profile, so that every score
shown to a judge is explainable ("you answered X, which maps to Y%").

Each question maps to exactly one Skill (by name - must match a name
seeded into the Skill table, see seed.py). Each option carries a fixed
proficiency value (0-100). Submitting the assessment writes these values
straight into StudentSkill rows - no randomness, no model call.
"""

QUESTIONS = [
    {
        "id": "python",
        "skill": "Python",
        "prompt": "How would you describe your Python experience?",
        "options": [
            {"label": "Never written Python", "value": 5},
            {"label": "Basic scripts and syntax", "value": 40},
            {"label": "Comfortable building applications/data pipelines", "value": 72},
            {"label": "Production-level, including testing & packaging", "value": 95},
        ],
    },
    {
        "id": "sql",
        "skill": "SQL",
        "prompt": "How comfortable are you with SQL and relational databases?",
        "options": [
            {"label": "Never used SQL", "value": 5},
            {"label": "Basic SELECT/WHERE queries", "value": 38},
            {"label": "Joins, aggregations, subqueries", "value": 70},
            {"label": "Query optimisation & schema design", "value": 93},
        ],
    },
    {
        "id": "data_analysis",
        "skill": "Data Analysis",
        "prompt": "Have you analysed real datasets to draw conclusions (Excel, pandas, etc.)?",
        "options": [
            {"label": "No experience", "value": 5},
            {"label": "Cleaned/summarised small datasets", "value": 42},
            {"label": "Built end-to-end analysis for a project", "value": 74},
            {"label": "Delivered analysis used for real decisions", "value": 92},
        ],
    },
    {
        "id": "power_bi",
        "skill": "Power BI",
        "prompt": "Your experience building dashboards (Power BI / Tableau)?",
        "options": [
            {"label": "None", "value": 5},
            {"label": "Followed a tutorial / built a toy dashboard", "value": 35},
            {"label": "Built dashboards for a course/project", "value": 68},
            {"label": "Built dashboards used by real stakeholders", "value": 90},
        ],
    },
    {
        "id": "statistics",
        "skill": "Statistics",
        "prompt": "How confident are you applying statistics (hypothesis testing, regression, etc.)?",
        "options": [
            {"label": "Not confident at all", "value": 8},
            {"label": "Know the basics (mean/variance/correlation)", "value": 40},
            {"label": "Can run and interpret standard tests", "value": 70},
            {"label": "Comfortable with advanced statistical modelling", "value": 92},
        ],
    },
    {
        "id": "react",
        "skill": "React/JS",
        "prompt": "Your experience with React or modern JavaScript frontend frameworks?",
        "options": [
            {"label": "None", "value": 5},
            {"label": "Basic components and state", "value": 40},
            {"label": "Built full features/apps", "value": 72},
            {"label": "Architected production frontend systems", "value": 94},
        ],
    },
    {
        "id": "cloud",
        "skill": "Cloud/DevOps",
        "prompt": "Your exposure to cloud platforms or DevOps (AWS/GCP/Azure, CI/CD, Docker)?",
        "options": [
            {"label": "None", "value": 5},
            {"label": "Deployed a small app once", "value": 35},
            {"label": "Comfortable with CI/CD and containers", "value": 68},
            {"label": "Design cloud infra / pipelines regularly", "value": 92},
        ],
    },
    {
        "id": "ml",
        "skill": "Machine Learning",
        "prompt": "Your Machine Learning / Data Science exposure?",
        "options": [
            {"label": "None", "value": 5},
            {"label": "Coursework only", "value": 38},
            {"label": "Built personal ML projects", "value": 70},
            {"label": "Shipped ML models to production", "value": 92},
        ],
    },
    {
        "id": "communication",
        "skill": "Communication",
        "prompt": "How would you rate your communication / presentation skills?",
        "options": [
            {"label": "Still building confidence", "value": 30},
            {"label": "Comfortable in small groups", "value": 55},
            {"label": "Present confidently to any audience", "value": 78},
            {"label": "Regularly lead presentations/negotiations", "value": 92},
        ],
    },
    {
        "id": "teamwork",
        "skill": "Teamwork",
        "prompt": "Your experience collaborating in team-based projects?",
        "options": [
            {"label": "Mostly worked solo", "value": 30},
            {"label": "Worked in small course-project teams", "value": 58},
            {"label": "Led a team on a significant project", "value": 80},
            {"label": "Regularly coordinate cross-functional teams", "value": 93},
        ],
    },
]

SKILL_NAMES = [q["skill"] for q in QUESTIONS]
