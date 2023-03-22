from database import Base
from sqlalchemy import Column, String
from passlib.context import CryptContext
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class PassMaster(Base):
    __tablename__ = 'passmasters'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    website = Column(String, nullable=False)
    email = Column(String, nullable=False)
    username = Column(String, nullable=False)
    encrypted_password = Column(String, nullable=False)

    def __repr__(self):
        return f"<PassMaster website={self.website} username={self.username}>"