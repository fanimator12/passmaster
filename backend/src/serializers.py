from typing import Dict, Optional
from pydantic import BaseModel

class PassMasterClass:
    def __init__(self):
        self.key = None
        self.pwd_dict = {}
        
class PassMaster(BaseModel):
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