from database import Base
from sqlalchemy import String, Integer, Column, Boolean, PickleType
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class PassMaster(Base):
    __tablename__ = 'passmaster'
    id = Column(Integer, primary_key=True, nullable=False)
    key = Column(String, nullable=False)
    pwd_dict = Column(PickleType, nullable = False)

    def __init__(self):
        self.key = None
        self.pwd_file = None
        self.pwd_dict = {}

    def __repr__(self):
        return f"<PassMaster key={self.key}>"
    
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    def verify_password(self, plain_password):
        return pwd_context.verify(plain_password, self.hashed_password)

    @staticmethod
    def get_password_hash(password):
        return pwd_context.hash(password)

    def __repr__(self):
        return f"<User username={self.username}>"