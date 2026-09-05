# Academia-Industry Collaboration Portal (SIH 26044) — starter

A minimal but fully working slice of the platform: student signup with
skills, industry signup with internship postings, a simple skill-overlap
matching engine, and an application/shortlisting flow. Academician and
institution roles are stubbed as "coming soon" pages — deliberately not
built yet, see "Scope for round one" below.

## Run it

```
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000 — it redirects to /login. Sign up as a
student and as an industry account (open two browsers, or one normal +
one incognito window, so you're not logged in as both at once) to see
the full flow.

## Project structure

```
app/
  main.py          entrypoint: creates the app, wires up routers, starts the DB
  database.py       SQLite engine + session dependency (swap the URL for Postgres later)
  models.py         User, Internship, Application - the shared schema. Change this together.
  auth.py           password hashing + "who's logged in" dependency
  matching.py        the skill-overlap scoring function
  routers/
    auth_routes.py   signup, login, logout
    dashboard.py     sends each role to its own dashboard
    students.py      student dashboard, matched internships, apply
    industries.py    industry dashboard, post internship, shortlist applicants
    placeholders.py  academician/institution "coming soon" pages
  templates/         Jinja2 + Bootstrap (loaded from CDN, no build step)
  static/            custom CSS (optional - Bootstrap does most of the work)
```

## Scope

This problem statement covers an entire platform (assessments, internships,
placements, FDPs, portfolios, institutional dashboards). Don't try to build
all of it tonight. This scaffold implements one complete flow — student
signup → skill matching → apply → industry shortlists — because a small
thing that fully works beats a big thing that's half-wired. Treat the
academician/institution roles as your "next round" roadmap slide, not
tonight's task.

## Known simplifications (fine for a hackathon, worth knowing about)

- Skills are stored as comma-separated strings (`"python,sql,react"`),
  not a proper many-to-many Skill table. Fast to build, fine for a demo.
  A real skills table with levels/categories is a good "if we advance"
  improvement.
- Matching is exact-string overlap (`matching.py`). No fuzzy matching,
  no weighting by skill importance. Enough to demo "intelligent
  matching" - upgrade later if you have time.
- Auth uses a signed session cookie (via `itsdangerous`/Starlette's
  `SessionMiddleware`), not JWT. Simpler to reason about for a first
  build. The `secret_key` in `main.py` is a placeholder - change it if
  you ever deploy this somewhere public.
- SQLite (`portal.db`, created automatically on first run). If you
  later deploy to a host with an ephemeral filesystem, switch
  `DATABASE_URL` in `database.py` to a Postgres URL - nothing else in
  the app needs to change, since everything goes through SQLModel.
