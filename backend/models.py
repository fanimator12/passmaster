from database import Base
from sqlalchemy import Column, String, JSON, Integer
from database import Base
from sqlalchemy import String, Integer, Column, Boolean
from passlib.context import CryptContext
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class PassMaster(Base):
    __tablename__ = 'passmasters'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    key = Column(String, nullable=False)
    pwd_dict = Column(JSON, nullable = False)

    def __init__(self):
        self.key = None
        self.pwd_file = None
        self.pwd_dict = {}

    def __repr__(self):
        return f"<PassMaster key={self.key}>"
    
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, unique=True, primary_key=True, index=True)
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