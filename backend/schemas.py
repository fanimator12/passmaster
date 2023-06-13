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
    key: str
    hashed_password: str
    
    class Config:
        orm_mode = True

class PasswordInput(BaseModel):
    website: str
    email: Optional[str]
    username: Optional[str]
    password: str

class PassMasterOutput(BaseModel):
    id: UUID
    website: str
    email: str
    username: str
    encrypted_password: str
    decrypted_password: Optional[str]

    class Config:
        orm_mode = True