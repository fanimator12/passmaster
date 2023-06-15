from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine

SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:fanimator@passmaster-db:5432/passmaster_db'
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

Base = declarative_base()
SessionLocal=sessionmaker(bind = engine)