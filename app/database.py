from sqlmodel import Session, SQLModel, create_engine

# SQLite for now. Swapping to Postgres later is just changing this URL
# (e.g. to "postgresql://user:pass@host/dbname") - nothing else in the
# app needs to change because we're using SQLModel, not raw SQL.
DATABASE_URL = "sqlite:///./portal.db"

engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
