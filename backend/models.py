from database import Base
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
import base64
from cryptography.fernet import Fernet, InvalidToken
import hashlib
from context import pwd_context
from datetime import datetime, timedelta
import pyotp

class PassMaster(Base):
    __tablename__ = 'passmasters'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    website = Column(String, nullable=True)
    email = Column(String, nullable=True)
    username = Column(String, nullable=True)
    encrypted_password = Column(String, nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)

    def generate_aes_key(self):
        if self.encrypted_password is None:
            return None
        key = hashlib.sha256(self.encrypted_password.encode()).digest()
        return base64.urlsafe_b64encode(key).decode()

    def encrypt_password(self, password):
        if password is None or password == self.get_decrypted_password(self.encrypted_password):
            return self.encrypted_password

        if self.aes_key is None:
            self.aes_key = self.generate_aes_key()
            if self.aes_key is None:
                return None

        f = Fernet(self.aes_key.encode())
        encrypted_password = f.encrypt(password.encode()).decode()
        self.encrypted_password = encrypted_password
        return encrypted_password

    def get_decrypted_password(self, encrypted_password):
        if self.aes_key is None:
            self.aes_key = self.generate_aes_key()
            if self.aes_key is None:
                return None

        if encrypted_password is None or encrypted_password == self.aes_key:
            return None

        f = Fernet(self.aes_key.encode())
        try:
            decrypted_password = f.decrypt(encrypted_password.encode()).decode()
            return decrypted_password
        except InvalidToken:
            return None

    def __repr__(self):
        return f"<PassMaster website={self.website} username={self.username}>"
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

class Key(Base):
    __tablename__ = 'keys'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    hashed_aes_key = Column(String, nullable=False)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        aes_key = Fernet.generate_key()
        self.hashed_aes_key = hashlib.sha256(aes_key).hexdigest()
    
class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    fullname = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    totp_secret = Column(String, default=pyotp.random_base32, nullable=False)
    
    passmasters = relationship("PassMaster", backref="user", primaryjoin="User.id == PassMaster.user_id")

    def check_password(self, password):
        return pwd_context.verify(password, self.hashed_password)
    
    def check_totp(self, token):
        totp = pyotp.TOTP(self.totp_secret)
        return totp.verify(token)
    
    def __repr__(self):
        return f"<User username={self.username} email={self.email}>"
    
    
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
