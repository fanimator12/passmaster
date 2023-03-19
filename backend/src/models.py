from database import Base
from sqlalchemy import String, Integer, Column

class PassMaster(Base):
    __tablename__ = 'passmaster'
    id = Column(Integer, primary_key=True, nullable=False)
    key = Column(Integer, nullable=False)
    pwd_file = Column(String, nullable = False)
    pwd_dict = Column(String[String], nullable = False)

    def __init__(self):
        self.key = None
        self.pwd_file = None
        self.pwd_dict = {}

    def __repr__(self):
        return f"<PassMaster key={self.key}>"