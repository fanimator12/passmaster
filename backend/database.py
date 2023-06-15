from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine

SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:fanimator@34.88.44.110:5432/passmaster'

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

Base = declarative_base()
SessionLocal=sessionmaker(bind = engine)

try:
    with engine.connect() as connection:
        result = connection.execute('SELECT 1')
        print(result.fetchone())
        print('Connection successful!')
except Exception as e:
    print('Connection failed:', str(e))