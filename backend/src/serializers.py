from typing import Dict, Optional
from pydantic import BaseModel
from uuid import UUID

class PassMasterClass:
    def __init__(self):
        self.id: UUID = None
        self.key = None
        self.pwd_dict = {}
        
class PassMaster(BaseModel):
    id: UUID
    key: str
    pwd_dict: Dict[str, str]

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None