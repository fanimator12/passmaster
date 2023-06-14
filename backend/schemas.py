from uuid import UUID
from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str
    email: str
    fullname: Optional[str] = None

class UserIn(User):
    password: str

class UserInDB(User):
    id: UUID
    hashed_password: str
    totp_secret: Optional[str] = None

    class Config:
        orm_mode = True

class PasswordInput(BaseModel):
    website: Optional[str]
    email: Optional[str]
    username: Optional[str]
    password: Optional[str]

class PassMasterOutput(BaseModel):
    id: UUID
    website: Optional[str]
    email: Optional[str]
    username: Optional[str]
    encrypted_password: Optional[str]

    class Config:
        orm_mode = True

class TotpToken(BaseModel):
    totp_token: str