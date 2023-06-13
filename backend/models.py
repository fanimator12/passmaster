from database import Base
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import validates, relationship
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from cryptography.fernet import Fernet
from context import pwd_context
from datetime import datetime, timedelta

class PassMaster(Base):
    __tablename__ = 'passmasters'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    website = Column(String, nullable=True)
    email = Column(String, nullable=True)
    username = Column(String, nullable=True)
    encrypted_password = Column(String, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f"<PassMaster website={self.website} username={self.username}>"
    
    def get_decrypted_password(self, key):
        f = Fernet(key)
        decrypted_password = f.decrypt(self.encrypted_password.encode())
        return decrypted_password.decode()
    
class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    fullname = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    key = Column(String, nullable=True) # AES key for each user
    
    passmasters = relationship("PassMaster", backref="user", primaryjoin="User.id == PassMaster.user_id")

    @validates("hashed_password")
    def validate_password(self, key, password):
        return pwd_context.hash(password)

    def check_password(self, password):
        return pwd_context.verify(password, self.hashed_password)
    
    def __repr__(self):
        return f"<User username={self.username} email={self.email}>"
    
    @property
    def aes_cipher(self):
        return Fernet(self.key.encode())
    
    def get_aes_key(self):
        return self.key
    
class Token(Base):
    __tablename__ = "tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    access_token = Column(String, unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)

    def is_expired(self):
        return datetime.utcnow() > self.expires_at

    def refresh(self, access_token_expiry):
        self.expires_at = datetime.utcnow() + timedelta(seconds=access_token_expiry)
