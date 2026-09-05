# SkillBridge

### Academia–Industry Collaboration Portal for Skill Mapping, Internships & Placement

> **SIH Problem Statement 26044 — Portal for Academia–Industry Collaboration for Skill Mapping, Internships and Placement**

SkillBridge is a centralized platform designed to bridge the gap between **what students learn** and **what industry actually needs**.

Instead of functioning as just another internship or job portal, SkillBridge connects the complete journey:

**Assess Skills → Identify Gaps → Learn → Discover Opportunities → Apply → Hire → Measure Outcomes**

The platform brings together **students, industries, academicians, and educational institutions** in one ecosystem.

---

## 🚨 The Problem

There is a persistent gap between the skills developed through academic education and the competencies expected by industry.

### For students

Students often struggle to answer:

* What skills are actually required for the career I want?
* How strong am I in those skills?
* What am I missing?
* What should I learn next?
* Which internships or jobs are realistic for my current profile?
* How can I make my profile more relevant to recruiters?

### For industry

Companies struggle to:

* Find candidates with the right skill sets.
* Communicate the skills required for opportunities.
* Identify suitable candidates efficiently.
* Understand the skill landscape of the student population.

### For institutions

Colleges and universities need better visibility into:

* Current industry skill requirements.
* Student skill gaps.
* Internship and placement readiness.
* Industry demand trends.
* Areas where curriculum and training can be strengthened.

### For academicians

Faculty and academicians also need access to:

* Faculty internships.
* Industrial training.
* Faculty Development Programs.
* Consultancy opportunities.
* Collaborative research.
* Industry interaction.

The result is a fragmented ecosystem where **learning, skills, opportunities and hiring outcomes are disconnected**.

---

# 💡 Our Solution

SkillBridge creates a shared ecosystem connecting:

```text
                    INDUSTRY
                       │
                 Skill Requirements
                       │
                       ▼
STUDENT ───────► SKILL MAPPING ◄────── INSTITUTION
   │                  │                    │
   │                  ▼                    │
   │             Skill Gaps                │
   │                  │                    │
   │                  ▼                    │
   └──────────► LEARNING ◄─────────────────┘
                      │
                      ▼
              INTERNSHIPS / JOBS
                      │
                      ▼
                  APPLICATION
                      │
                      ▼
                    HIRING
                      │
                      ▼
               OUTCOME ANALYTICS
```

The goal is not simply to connect students with vacancies.

The goal is to create a **continuous feedback loop between education and employment**.

---

# ⭐ What Makes SkillBridge Different?

Existing platforms primarily answer:

> **"What opportunities are available?"**

SkillBridge additionally answers:

> **"Why is this opportunity relevant to me?"**

> **"What skills am I missing?"**

> **"What should I learn to become a stronger candidate?"**

> **"What skills are commonly demonstrated by people previously hired for this type of role?"**

> **"Where is the gap between industry demand and student capability?"**

This transforms the platform from an **opportunity marketplace** into a **skill intelligence and career development ecosystem**.

---

# 🎯 Core MVP

The MVP focuses on the most important end-to-end journey.

## 1. Student Skill Profile

Students maintain a structured profile containing:

* Technical skills
* Soft skills
* Skill proficiency
* Career interests
* Projects
* Certifications
* Courses
* Internships
* Achievements

---

## 2. Skill Assessment

Students can complete assessments to evaluate their technical and soft skills.

The system converts assessment results into a skill profile.

### Example

```text
Python             █████████░  90%
SQL                ██████░░░░  60%
Data Analysis      ████████░░  80%
Communication      ███████░░░  70%
Power BI           ████░░░░░░  40%
```

This profile becomes the foundation for opportunity matching and learning recommendations.

---

# 3. Explainable Skill Matching**FIRST inspect the existing repository and the requirements in this prompt. Then immediately implement the MVP. Do not spend time discussing architecture, proposing alternatives, or asking me what to build. Make reasonable decisions yourself. Prioritize a working end-to-end demo over architectural perfection.FIRST inspect the existing repository and the requirements in this prompt. Then immediately implement the MVP. Do not spend time discussing architecture, proposing alternatives, or asking me what to build. Make reasonable decisions yourself. Prioritize a working end-to-end demo over architectural perfection.FIRST inspect the existing repository and the requirements in this prompt. Then immediately implement the MVP. Do not spend time discussing architecture, proposing alternatives, or asking me what to build. Make reasonable decisions yourself. Prioritize a working end-to-end demo over architectural perfection.**

Instead of showing an unexplained:

> **87% Match**

SkillBridge explains the score.

### Example

**Data Analyst Intern — 87% Match**

```text
✓ Python
✓ SQL
✓ Data Analysis
✓ Communication

⚠ Power BI — Missing
⚠ Statistics — Weak
```

The student can immediately understand:

* Why the opportunity was recommended.
* Which requirements they already satisfy.
* Which skills they need to improve.

### Matching philosophy

The MVP uses a transparent, deterministic matching approach based primarily on:

* Required skill compatibility
* Preferred skill compatibility
* Career interests
* Eligibility
* Relevant projects/experience

The same input produces the same result.

This keeps recommendations **explainable and trustworthy**.

---

# 4. Personalized Learning Recommendations

SkillBridge connects skill gaps to learning.

If an opportunity requires:

```text
Python ✓
SQL ✓
Power BI ✗
```

the system can recommend learning resources targeting the missing skill.

### Example

> **Skill Gap Detected: Power BI**

Recommended:

* Power BI Fundamentals
* Data Visualization Training
* Business Intelligence Workshop

The purpose is not simply to recommend random courses.

The recommendation starts with:

**"What skill does the student need?"**

---

# 5. Industry Opportunity Portal

Companies can publish:

* Internships
* Jobs
* Projects
* Apprenticeships
* Entry-level opportunities

Each opportunity can specify:

* Required skills
* Preferred skills
* Eligibility
* Duration
* Location
* Work mode
* Description

Students can discover and apply to relevant opportunities from the same platform.

---

# 6. Explainable Candidate Ranking

Companies can view applicants ranked by skill compatibility.

### Example

```text
Candidate       Match

Aarav           91%
Priya            86%
Rahul            78%
Ananya           72%
```

Recruiters can drill into each candidate to see:

```text
Matched Skills
✓ Python
✓ SQL
✓ Data Analysis

Skill Gaps
⚠ Power BI

Relevant Projects
• Sales Analytics Dashboard
• Customer Churn Analysis
```

This provides recruiters with **context**, not just a score.

---

# ⭐ 7. Hiring Insights

One of SkillBridge's key differentiators is connecting opportunity requirements with historical hiring information.

Suppose a company has previously hired 20 candidates for a Data Analyst role.

The platform can identify skills and learning experiences that were **commonly observed among those hires**.

### Example

**ABC Technologies — Data Analyst Intern**

Previous hires: **20**

| Skill         | Observed |
| ------------- | -------: |
| Python        |  16 / 20 |
| SQL           |  15 / 20 |
| Data Analysis |  14 / 20 |
| Power BI      |  11 / 20 |

### Learning patterns

| Learning              | Observed |
| --------------------- | -------: |
| SQL Certification     |  10 / 20 |
| Data Analytics Course |   9 / 20 |

The student can therefore see:

> **"SQL was commonly demonstrated by previous hires for this role."**

This helps students make more informed decisions about skill development.

### Important

SkillBridge does **not** claim that a particular course causes someone to get hired.

The system reports:

* Commonly observed skills
* Commonly observed learning
* Historical patterns

This keeps the insight explainable rather than making unsupported causal claims.

---

# 📊 8. Industry Demand vs Student Supply

SkillBridge also looks at the problem from the institution's perspective.

By aggregating the skills required across opportunities, the platform can estimate current industry demand and compare it with student capability.

### Example

| Skill  | Industry Demand | Student Supply |     Gap |
| ------ | --------------: | -------------: | ------: |
| Python |             82% |            71% |     11% |
| SQL    |             76% |            48% | **28%** |
| React  |             61% |            55% |      6% |
| Cloud  |             49% |            19% | **30%** |

This answers a much bigger question:

> **"Where is the gap between what industry needs and what our students currently have?"**

Institutions can use this insight to guide:

* Training programs
* Workshops
* Curriculum enhancement
* Industry partnerships
* Placement preparation

---

# 🏫 9. Institutional Dashboard

Institutions can monitor:

### Student Readiness

* Total students
* Internship-ready students
* Placement-ready students
* Skill assessment completion
* Skill gaps

### Industry Demand

* Most requested skills
* Emerging skills
* Skill demand trends
* Demand vs student supply

### Outcomes

* Internship participation
* Applications
* Shortlists
* Placements
* Recruitment outcomes

The institution therefore gets visibility into the entire student development pipeline.

---

# 👨‍🏫 10. Academia & Industry Collaboration

The complete platform is designed to support collaboration beyond recruitment.

The broader platform can support:

### For academicians

* Faculty internships
* Industrial training
* FDPs
* Consultancy
* Research collaboration

### For students

* Mentorship
* Workshops
* Guest lectures
* Innovation challenges
* Live industry projects

### For institutions

* Industry partnerships
* Training programs
* Skill-gap analytics
* Placement analytics

These capabilities form the expansion roadmap beyond the MVP.

---

# 👥 Platform Roles

SkillBridge is designed around four major stakeholders.

| Role              | Primary Need                              |
| ----------------- | ----------------------------------------- |
| 👨‍🎓 Student     | Skills, learning, internships, placements |
| 🏢 Industry       | Talent discovery and recruitment          |
| 👨‍🏫 Academician | Industry exposure and collaboration       |
| 🏫 Institution    | Student readiness and industry analytics  |

---

# 🔄 End-to-End User Journey

The central experience can be summarized as:

```text
Student
   │
   ▼
Skill Assessment
   │
   ▼
Skill Profile
   │
   ▼
Target Career / Opportunity
   │
   ▼
Skill Gap Analysis
   │
   ├──────────────► Learning Recommendations
   │
   ▼
Explainable Opportunity Matching
   │
   ▼
Application
   │
   ▼
Recruiter Evaluation
   │
   ▼
Hiring Outcome
   │
   ▼
Hiring & Skill Insights
   │
   ▼
Institutional Analytics
```

This creates a feedback loop rather than a one-time job search.

---

# 🧠 Why We Avoid "Fake AI"

A major design principle of SkillBridge is:

> **Use intelligence where it improves decisions, not where it merely makes the interface sound futuristic.**

The MVP prioritizes:

* Deterministic matching
* Explainable recommendations
* Transparent scoring
* Consistent data
* Evidence-based insights

A recommendation should be explainable to a student, recruiter, institution and judge.

The architecture can later incorporate more advanced ML/AI models as the dataset grows, but the core platform should remain interpretable.

---

# 🛠️ Technology Stack

The current MVP is built around:

* **Backend:** FastAPI
* **Database:** SQLite / SQLModel
* **Authentication:** Session-based authentication
* **Frontend:** Jinja2 + Bootstrap
* **Language:** Python

The stack is intentionally lightweight to allow rapid development and demonstration.

The system can later migrate to production infrastructure such as PostgreSQL and additional services without changing the core product concept.

---

# 📁 Project Structure

```text
app/
├── main.py
├── database.py
├── models.py
├── auth.py
├── matching.py
│
├── routers/
│   ├── auth_routes.py
│   ├── dashboard.py
│   ├── students.py
│   ├── industries.py
│   └── ...
│
├── templates/
│
└── static/
```

---

# 🚀 Running Locally

## 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

## 2. Create a virtual environment

```bash
python3 -m venv venv
```

### Linux / macOS

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

## 4. Start the application

```bash
uvicorn app.main:app --reload
```

Open:

```text
http://127.0.0.1:8000
```

---

# 🎬 Recommended SIH Demo

The application is designed around a short story rather than a collection of unrelated features.

### Step 1 — Student

Login as a student.

Show:

**"This is what I know."**

Open the skill profile.

---

### Step 2 — Skill Gap

Select a target opportunity.

Show:

**"This is what the industry requires."**

Then show:

**"These are my gaps."**

---

### Step 3 — Learning

Show:

**"Here is what I should learn to close those gaps."**

---

### Step 4 — Opportunity

Show recommended internships/jobs.

Explain:

**"This opportunity is recommended because my skills match these requirements."**

---

### Step 5 — Recruiter

Switch to the industry account.

Show applicants ranked by skill compatibility.

Open a candidate.

Demonstrate that the recruiter can see:

* Matching skills
* Missing skills
* Relevant experience

---

### Step 6 — Hiring Insights

Open:

**Hiring Insights**

Show:

> "These skills were commonly observed among previous hires."

This is one of the core differentiators of the platform.

---

### Step 7 — Institution

Switch to the institution dashboard.

Show:

> **Industry Demand vs Student Supply**

Then explain:

> "The same data that helps an individual student understand their skill gap can help an institution understand the skill gaps of its student population."

That is the key Academia–Industry connection.

---

# 🏆 Our Core Value Proposition

### For Students

**Know what you have.**
**Know what you're missing.**
**Know what to learn.**
**Know where you fit.**

### For Industry

**Define the skills you need.**
**Find candidates who match.**
**Understand their strengths and gaps.**

### For Institutions

**See what industry needs.**
**See where students fall short.**
**Use data to improve readiness.**

### For Academia

**Connect teaching and academic development with real industry requirements and opportunities.**

---

# 🔮 Future Scope

The MVP intentionally focuses on the most important end-to-end flow.

The platform can later expand into:

* Advanced ML-based skill recommendations
* Resume parsing and skill extraction
* Automated aptitude assessment
* Verified certificates
* Secure academic document management
* External LMS integration
* Certification-provider integration
* Faculty internship workflows
* FDP management
* Mentorship
* Live projects
* Research collaboration
* Innovation challenges
* Internship progress tracking
* Mentor feedback
* Internship completion records
* Advanced recruitment workflows
* Predictive placement-readiness analytics
* Industry skill-demand forecasting
* Institutional curriculum recommendations

These are **future extensions**, not requirements for the initial MVP.

---

# 🧩 Product Philosophy

SkillBridge is built around one principle:

> **The platform should not merely connect students to opportunities. It should make the connection between education and employment measurable.**

The long-term vision is a continuous feedback loop:

```text
ACADEMIA
    │
    ▼
Student Skills
    │
    ▼
Industry Requirements
    │
    ▼
Skill Gap
    │
    ▼
Learning & Development
    │
    ▼
Internship / Placement
    │
    ▼
Hiring Outcomes
    │
    ▼
Analytics
    │
    └──────────────► Better Training
                           │
                           └──────► Better Skills
```

---

# 👥 Team

**Team of 6 — SIH Internal Hackathon**

Built for:

**Smart India Hackathon**

Problem Statement:

**SIH 26044**

Category:

**Software**

Theme:

**Smart Automation**

---

# 📌 Project Status

### Current focus

**SIH Internal Hackathon MVP**

### Priority

1. Working end-to-end student journey
2. Explainable skill matching
3. Learning recommendations
4. Industry candidate matching
5. Hiring insights
6. Institutional skill-demand analytics
7. Reliable demo experience

The objective is not to build every feature described in the long-term vision.

The objective is to demonstrate a **coherent, working solution to the core Academia–Industry skill-gap problem**.

---

## Built with a simple idea:

### **Don't just find opportunities. Find the skills that get you there.**
