"""
Comprehensive seed script for SkillBridge demo.
Creates coherent demo data: multiple students with different skill profiles,
industry opportunities, skill gaps, courses, hiring records, and applications.
"""
from app.database import create_db_and_tables, engine
from app.auth import hash_password
from app.models import (
    User, Role, Skill, StudentSkill, Opportunity, OpportunitySkill,
    RequirementLevel, Application, ApplicationStatus, Course, StudentCourse,
    HiringRecord, Project, Certificate, Internship, Job,
    AcademicOpportunity, AcademicOpportunityType, TrainingProgram,
    Assessment, AssessmentResult,
)
from sqlmodel import Session, select
from datetime import datetime, timedelta


def seed_data():
    create_db_and_tables()

    with Session(engine) as session:
        # Check if already seeded
        if session.exec(select(Skill)).first():
            print("Database already seeded. Skipping.")
            return

        print("Seeding SkillBridge demo data...")

        # ═══════════════════════════════════════════════
        # 1. SKILLS
        # ═══════════════════════════════════════════════
        skills_data = [
            ("Python", "technical"),
            ("SQL", "technical"),
            ("Data Analysis", "technical"),
            ("Power BI", "technical"),
            ("Statistics", "technical"),
            ("React/JS", "technical"),
            ("Cloud/DevOps", "technical"),
            ("Machine Learning", "technical"),
            ("Communication", "soft"),
            ("Teamwork", "soft"),
        ]
        skills = {}
        for name, cat in skills_data:
            s = Skill(name=name, category=cat)
            session.add(s)
            session.flush()
            skills[name] = s
        session.commit()

        # ═══════════════════════════════════════════════
        # 2. USERS
        # ═══════════════════════════════════════════════
        pwd = hash_password("password")

        # Institution
        institution = User(name="Global Tech Institute", email="admin@gti.edu", hashed_password=pwd, role=Role.institution)
        session.add(institution)
        session.flush()

        # Students (linked to institution)
        alice = User(name="Alice Sharma", email="alice@student.com", hashed_password=pwd, role=Role.student,
                     skills="python,sql,react", bio="CS major, interested in data science and web dev.",
                     career_interest="data analyst", institution_id=institution.id)
        bob = User(name="Bob Kumar", email="bob@student.com", hashed_password=pwd, role=Role.student,
                   skills="python,machine learning", bio="ML enthusiast with research experience.",
                   career_interest="machine learning", institution_id=institution.id)
        carol = User(name="Carol Menon", email="carol@student.com", hashed_password=pwd, role=Role.student,
                     skills="react,javascript,css", bio="Frontend developer, building side projects.",
                     career_interest="full-stack developer", institution_id=institution.id)
        dave = User(name="Dave Patel", email="dave@student.com", hashed_password=pwd, role=Role.student,
                    skills="sql,power bi", bio="Business analytics student, learning data tools.",
                    career_interest="business analyst", institution_id=institution.id)
        eve = User(name="Eve Krishnan", email="eve@student.com", hashed_password=pwd, role=Role.student,
                   skills="python,cloud,devops", bio="Cloud computing enthusiast.",
                   career_interest="devops engineer", institution_id=institution.id)

        session.add_all([alice, bob, carol, dave, eve])
        session.flush()

        # Industry
        techcorp = User(name="TechCorp Industries", email="hr@techcorp.com", hashed_password=pwd,
                        role=Role.industry, company_name="TechCorp Inc.")
        datawise = User(name="DataWise Analytics", email="hr@datawise.com", hashed_password=pwd,
                        role=Role.industry, company_name="DataWise Analytics")
        session.add_all([techcorp, datawise])
        session.flush()

        # Academician
        academician = User(name="Dr. Ramesh Iyer", email="alan@university.edu", hashed_password=pwd, role=Role.academician)
        session.add(academician)
        session.commit()

        # ═══════════════════════════════════════════════
        # 3. STUDENT SKILLS (varying proficiency)
        # ═══════════════════════════════════════════════
        student_skills = [
            # Alice: strong Python/SQL/Data Analysis, weak Power BI/Stats
            (alice.id, "Python", 90), (alice.id, "SQL", 72), (alice.id, "Data Analysis", 80),
            (alice.id, "Power BI", 25), (alice.id, "Statistics", 45), (alice.id, "React/JS", 62),
            (alice.id, "Communication", 75), (alice.id, "Teamwork", 70),
            # Bob: strong ML/Python, weak SQL/Cloud
            (bob.id, "Python", 88), (bob.id, "Machine Learning", 85), (bob.id, "Statistics", 78),
            (bob.id, "SQL", 40), (bob.id, "Data Analysis", 70), (bob.id, "Cloud/DevOps", 20),
            (bob.id, "Communication", 55), (bob.id, "Teamwork", 58),
            # Carol: strong React, weak backend
            (carol.id, "React/JS", 92), (carol.id, "Python", 35), (carol.id, "SQL", 30),
            (carol.id, "Cloud/DevOps", 45), (carol.id, "Communication", 80), (carol.id, "Teamwork", 85),
            # Dave: moderate BI/SQL, weak programming
            (dave.id, "SQL", 65), (dave.id, "Power BI", 70), (dave.id, "Data Analysis", 55),
            (dave.id, "Statistics", 50), (dave.id, "Python", 28), (dave.id, "Communication", 82),
            (dave.id, "Teamwork", 78),
            # Eve: strong Cloud/Python, weak frontend
            (eve.id, "Python", 75), (eve.id, "Cloud/DevOps", 88), (eve.id, "SQL", 60),
            (eve.id, "Machine Learning", 40), (eve.id, "React/JS", 15),
            (eve.id, "Communication", 65), (eve.id, "Teamwork", 72),
        ]
        for sid, skill_name, prof in student_skills:
            session.add(StudentSkill(student_id=sid, skill_id=skills[skill_name].id, proficiency=prof))
        session.commit()

        # ═══════════════════════════════════════════════
        # 4. OPPORTUNITIES (with skill requirements)
        # ═══════════════════════════════════════════════
        opp1 = Opportunity(industry_id=techcorp.id, title="Data Analyst Intern",
                           description="Work with our analytics team on customer insights and dashboards.",
                           type="internship", stipend="₹15,000/mo", location="Bangalore", work_mode="hybrid", duration="6 months")
        opp2 = Opportunity(industry_id=techcorp.id, title="Full-Stack Developer Intern",
                           description="Build features for our core SaaS product using React and Python.",
                           type="internship", stipend="₹18,000/mo", location="Chennai", work_mode="on-site", duration="3 months")
        opp3 = Opportunity(industry_id=datawise.id, title="ML Research Assistant",
                           description="Assist in building predictive models for healthcare analytics.",
                           type="research", stipend="₹12,000/mo", location="Remote", work_mode="remote", duration="4 months")
        opp4 = Opportunity(industry_id=datawise.id, title="Business Intelligence Analyst",
                           description="Create dashboards and reports for enterprise clients using Power BI.",
                           type="job", stipend="₹4.5 LPA", location="Mumbai", work_mode="hybrid", duration="Full-time")
        opp5 = Opportunity(industry_id=techcorp.id, title="Cloud DevOps Engineer",
                           description="Manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure.",
                           type="job", stipend="₹6 LPA", location="Hyderabad", work_mode="on-site", duration="Full-time")

        session.add_all([opp1, opp2, opp3, opp4, opp5])
        session.commit()

        # Opportunity skills
        opp_skills = [
            # Data Analyst: required Python, SQL, Data Analysis; preferred Power BI, Statistics
            (opp1.id, "Python", "required"), (opp1.id, "SQL", "required"), (opp1.id, "Data Analysis", "required"),
            (opp1.id, "Power BI", "preferred"), (opp1.id, "Statistics", "preferred"), (opp1.id, "Communication", "preferred"),
            # Full-Stack: required React, Python, SQL; preferred Cloud
            (opp2.id, "React/JS", "required"), (opp2.id, "Python", "required"), (opp2.id, "SQL", "required"),
            (opp2.id, "Cloud/DevOps", "preferred"), (opp2.id, "Teamwork", "preferred"),
            # ML Research: required Python, ML, Statistics; preferred Data Analysis
            (opp3.id, "Python", "required"), (opp3.id, "Machine Learning", "required"), (opp3.id, "Statistics", "required"),
            (opp3.id, "Data Analysis", "preferred"),
            # BI Analyst: required SQL, Power BI, Data Analysis; preferred Statistics, Communication
            (opp4.id, "SQL", "required"), (opp4.id, "Power BI", "required"), (opp4.id, "Data Analysis", "required"),
            (opp4.id, "Statistics", "preferred"), (opp4.id, "Communication", "preferred"),
            # DevOps: required Cloud, Python; preferred SQL
            (opp5.id, "Cloud/DevOps", "required"), (opp5.id, "Python", "required"),
            (opp5.id, "SQL", "preferred"),
        ]
        for oid, skill_name, req in opp_skills:
            session.add(OpportunitySkill(
                opportunity_id=oid, skill_id=skills[skill_name].id,
                requirement=RequirementLevel.required if req == "required" else RequirementLevel.preferred
            ))
        session.commit()

        # ═══════════════════════════════════════════════
        # 5. APPLICATIONS
        # ═══════════════════════════════════════════════
        session.add_all([
            Application(student_id=alice.id, opportunity_id=opp1.id, status=ApplicationStatus.shortlisted),
            Application(student_id=bob.id, opportunity_id=opp3.id, status=ApplicationStatus.applied),
            Application(student_id=carol.id, opportunity_id=opp2.id, status=ApplicationStatus.applied),
            Application(student_id=dave.id, opportunity_id=opp4.id, status=ApplicationStatus.applied),
            Application(student_id=eve.id, opportunity_id=opp5.id, status=ApplicationStatus.shortlisted),
            Application(student_id=alice.id, opportunity_id=opp2.id, status=ApplicationStatus.applied),
        ])
        session.commit()

        # ═══════════════════════════════════════════════
        # 6. COURSES (learning recommendations)
        # ═══════════════════════════════════════════════
        session.add_all([
            Course(industry_id=techcorp.id, title="SQL for Data Analytics", provider="TechCorp Academy",
                   description="Master SQL queries, joins, aggregations, and window functions for analytics.",
                   skills_covered="SQL, Data Analysis", link="https://techcorp.com/sql", duration="4 weeks"),
            Course(industry_id=datawise.id, title="Power BI Fundamentals", provider="DataWise Training",
                   description="Build interactive dashboards and business reports with Power BI.",
                   skills_covered="Power BI, Data Analysis", link="https://datawise.com/powerbi", duration="3 weeks"),
            Course(industry_id=techcorp.id, title="Python for Data Science", provider="TechCorp Academy",
                   description="Learn Python with pandas, NumPy, and matplotlib for data work.",
                   skills_covered="Python, Data Analysis, Statistics", link="https://techcorp.com/python", duration="6 weeks"),
            Course(title="Cloud Computing Essentials", provider="AWS Academy",
                   description="AWS fundamentals: EC2, S3, Lambda, and CI/CD pipelines.",
                   skills_covered="Cloud/DevOps", link="https://aws.com/academy", duration="5 weeks"),
            Course(title="Machine Learning with Python", provider="Coursera",
                   description="Build ML models: regression, classification, clustering, and neural networks.",
                   skills_covered="Machine Learning, Python, Statistics", link="https://coursera.org/ml", duration="8 weeks"),
            Course(title="React Frontend Mastery", provider="Udemy",
                   description="Modern React with hooks, context, and production patterns.",
                   skills_covered="React/JS", link="https://udemy.com/react", duration="6 weeks"),
            Course(title="Statistics for Business", provider="Khan Academy",
                   description="Practical statistics: hypothesis testing, regression, and visualization.",
                   skills_covered="Statistics, Data Analysis", link="https://khanacademy.org/stats", duration="4 weeks"),
            Course(title="Communication Skills for Engineers", provider="LinkedIn Learning",
                   description="Technical writing, presentations, and stakeholder communication.",
                   skills_covered="Communication", link="https://linkedin.com/learning", duration="2 weeks"),
        ])
        session.commit()

        # ═══════════════════════════════════════════════
        # 7. HIRING RECORDS (for hiring insights)
        # ═══════════════════════════════════════════════
        hiring_data = [
            # TechCorp past Data Analyst hires
            (techcorp.id, "Data Analyst Intern", "Python, SQL, Data Analysis", "SQL for Data Analytics"),
            (techcorp.id, "Data Analyst Intern", "Python, SQL, Data Analysis, Power BI", "Python for Data Science"),
            (techcorp.id, "Data Analyst Intern", "Python, SQL, Statistics", "SQL for Data Analytics"),
            (techcorp.id, "Data Analyst Intern", "Python, SQL, Data Analysis, Statistics", "SQL for Data Analytics, Statistics for Business"),
            (techcorp.id, "Data Analyst Intern", "Python, SQL, Data Analysis", "Python for Data Science"),
            (techcorp.id, "Data Analyst Intern", "Python, SQL, Power BI", "Power BI Fundamentals"),
            # TechCorp past Full-Stack hires
            (techcorp.id, "Full-Stack Developer Intern", "React/JS, Python, SQL", "React Frontend Mastery"),
            (techcorp.id, "Full-Stack Developer Intern", "React/JS, Python, SQL, Cloud/DevOps", "Cloud Computing Essentials"),
            (techcorp.id, "Full-Stack Developer Intern", "React/JS, Python, Cloud/DevOps", "React Frontend Mastery"),
            (techcorp.id, "Full-Stack Developer Intern", "React/JS, Python, SQL", "Python for Data Science"),
            # DataWise past ML hires
            (datawise.id, "ML Research Assistant", "Python, Machine Learning, Statistics", "Machine Learning with Python"),
            (datawise.id, "ML Research Assistant", "Python, Machine Learning, Statistics, Data Analysis", "Machine Learning with Python, Python for Data Science"),
            (datawise.id, "ML Research Assistant", "Python, Machine Learning", "Machine Learning with Python"),
        ]
        for ind_id, role, skills_str, courses_str in hiring_data:
            session.add(HiringRecord(industry_id=ind_id, role_title=role, skills_demonstrated=skills_str, courses_completed=courses_str))
        session.commit()

        # ═══════════════════════════════════════════════
        # 8. PORTFOLIO ITEMS
        # ═══════════════════════════════════════════════
        session.add_all([
            Project(student_id=alice.id, title="Customer Churn Predictor",
                    description="ML model to predict customer churn using Python and scikit-learn.",
                    link="https://github.com/alice/churn-predictor"),
            Project(student_id=alice.id, title="Sales Analytics Dashboard",
                    description="Interactive Power BI dashboard analyzing regional sales trends.",
                    link="https://github.com/alice/sales-dashboard"),
            Project(student_id=bob.id, title="Image Classification API",
                    description="REST API serving a CNN model for medical image classification.",
                    link="https://github.com/bob/img-classify"),
            Project(student_id=carol.id, title="Task Management App",
                    description="Full-stack React + Express app with drag-and-drop boards.",
                    link="https://github.com/carol/taskboard"),
            Certificate(student_id=alice.id, title="Google Data Analytics Professional",
                       issuer="Google / Coursera", issue_date=datetime.utcnow() - timedelta(days=90)),
            Certificate(student_id=bob.id, title="AWS Certified Cloud Practitioner",
                       issuer="Amazon Web Services", issue_date=datetime.utcnow() - timedelta(days=60)),
            Certificate(student_id=carol.id, title="Meta Frontend Developer",
                       issuer="Meta / Coursera", issue_date=datetime.utcnow() - timedelta(days=45)),
        ])
        session.commit()

        # ═══════════════════════════════════════════════
        # 9. ACADEMIC OPPORTUNITIES
        # ═══════════════════════════════════════════════
        session.add_all([
            AcademicOpportunity(creator_id=techcorp.id, type=AcademicOpportunityType.research,
                                title="AI in Healthcare Research",
                                description="Collaborate on predictive health models using ML and clinical data."),
            AcademicOpportunity(creator_id=datawise.id, type=AcademicOpportunityType.fdp,
                                title="FDP: Data Visualization with Modern Tools",
                                description="5-day faculty development program on Power BI, Tableau, and D3.js."),
            AcademicOpportunity(creator_id=techcorp.id, type=AcademicOpportunityType.industrial_training,
                                title="Industry Immersion Programme",
                                description="2-week industrial training for faculty in cloud and DevOps practices."),
            AcademicOpportunity(creator_id=datawise.id, type=AcademicOpportunityType.consultancy,
                                title="Analytics Consultancy Project",
                                description="Faculty consultancy opportunity for enterprise data strategy."),
        ])
        session.commit()

        # ═══════════════════════════════════════════════
        # 10. LEGACY MODELS (backward compatibility)
        # ═══════════════════════════════════════════════
        session.add_all([
            Internship(industry_id=techcorp.id, title="Data Science Intern",
                       description="Work with big data pipelines and ML models.",
                       required_skills="python,sql,pandas"),
            Job(industry_id=techcorp.id, title="Junior Frontend Developer",
                description="React developer for core product team.",
                required_skills="react,javascript,css"),
            TrainingProgram(industry_id=techcorp.id, title="TechCorp React Bootcamp",
                           description="4-week intensive bootcamp covering modern React.",
                           skills_covered="react,hooks,redux", link="https://techcorp.com/bootcamp"),
            Assessment(title="Python Core Programming",
                      description="Test your knowledge of Python.",
                      skill_category="python"),
            Assessment(title="Frontend Web Development",
                      description="HTML, CSS, and JavaScript concepts.",
                      skill_category="javascript"),
        ])
        session.commit()

        print("✅ Seeded successfully!")
        print("Demo accounts (all password: 'password'):")
        print("  Student:     alice@student.com, bob@student.com, carol@student.com, dave@student.com, eve@student.com")
        print("  Industry:    hr@techcorp.com, hr@datawise.com")
        print("  Academician: alan@university.edu")
        print("  Institution: admin@gti.edu")


if __name__ == "__main__":
    seed_data()
