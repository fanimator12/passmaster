from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine

SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:fanimator@35.228.140.143:5432/postgres'

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

Base = declarative_base()
SessionLocal=sessionmaker(bind = engine)