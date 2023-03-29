from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, validator
from sqlalchemy.orm import Session
from database import SessionLocal
from models import PassMaster
from typing import List, Optional
from cryptography.fernet import Fernet
from context import pwd_context, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from jose import JWTError, jwt, ExpiredSignatureError
from datetime import datetime, timedelta

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserBase(BaseModel):
    username: str
    email: EmailStr
    password: str

    @validator("password")
    def password_must_be_strong(cls, v):
        # Add your password strength validation here
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

class UserCreate(UserBase):
    confirm_password: str

    @validator("confirm_password")
    def passwords_match(cls, v, values, **kwargs):
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v

class User(UserBase):
    id: UUID
    hashed_password: str
    key: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

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

    class Config:
        orm_mode = True

class Crypto:
    def __init__(self, key):
        self.key = key.encode()

    def encrypt(self, message):
        f = Fernet(self.key)
        encrypted = f.encrypt(message.encode())
        return encrypted.decode()

    def decrypt(self, ciphertext):
        f = Fernet(self.key)
        print(self.key)
        decrypted = f.decrypt(ciphertext.encode())
        return decrypted.decode()

def create_access_token(data: dict, expires_delta: timedelta = None):

    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_token(email: str, password: str, db: Session = Depends(get_db)):
    # Retrieve the user from the database
    user = db.query(User).filter(User.email == email).first()
    
    # Check if the user exists and if the password is correct
    if user and pwd_context.verify(password, user.hashed_password):
        # If the user exists and the password is correct, generate a token with the user's email and key
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": user.email, "key": user.key}, expires_delta=access_token_expires)
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        # If the user does not exist or the password is incorrect, raise an HTTPException
        raise HTTPException(status_code=401, detail="Incorrect email or password")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(get_token)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        key: str = payload.get("key")
        if email is None:
            raise "Missing sub claim in token"
        token_data = Token(email=email)
    except JWTError:
        raise "Could not validate credentials"
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise "Could not find user with provided credentials"
    crypto = Crypto(key)
    return user, crypto

# CREATE NEW USER

@router.post("/create_user", response_model=Token)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    hashed_password = pwd_context.hash(user.password)
    key = Fernet.generate_key().decode()
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password, key=key)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": db_user.email}, key=db_user.key, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

# LOGIN FOR USER


@router.post("/login", response_model=Token)
def login_for_access_token(email: str, password: str, db: Session = Depends(get_db)):
    # Retrieve the user from the database
    user = db.query(User).filter(User.email == email).first()
    
    # Check if the user exists and if the password is correct
    if user and pwd_context.verify(password, user.hashed_password):
        # If the user exists and the password is correct, generate a token with the user's email and key
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": user.email, "key": user.key}, key=user.key, expires_delta=access_token_expires)
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        # If the user does not exist or the password is incorrect, raise an HTTPException
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
@router.get("/user", response_model=User)
def get_user(current_user: User = Depends(get_current_user)):
    return current_user

# GET ALL PASSWORDS


@router.get("/get_all_passwords", response_model=List[PassMasterOutput])
def get_all_passwords(db: Session = Depends(get_db)):
    passmasters = db.query(PassMaster).all()
    passmasters_output = [PassMasterOutput(
        id=passmaster.id,
        website=passmaster.website,
        email=passmaster.email,
        username=passmaster.username,
        encrypted_password=passmaster.encrypted_password
    ) for passmaster in passmasters]
    return passmasters_output

# SAVE PASSWORD


@router.post("/save_password", response_model=PassMasterOutput, status_code=200)
def save_password(password_data: PasswordInput, key: str, db: Session = Depends(get_db)):
    crypto = Crypto(key)

    # Encrypt the password using the generated key
    encrypted_password = crypto.encrypt(password_data.password)

    # Create a new PassMaster object with the encrypted password
    new_passmaster = PassMaster(
        website=password_data.website,
        email=password_data.email,
        username=password_data.username,
        encrypted_password=encrypted_password
    )

    # Add the new PassMaster object to the database
    db.add(new_passmaster)
    db.commit()
    db.refresh(new_passmaster)

    # Return the created PassMaster object
    return PassMasterOutput(
        id=new_passmaster.id,
        website=new_passmaster.website,
        email=new_passmaster.email,
        username=new_passmaster.username,
        encrypted_password=new_passmaster.encrypted_password
    )

# GET PASSWORD


@router.get("/get_password", response_model=PassMasterOutput, status_code=200)
def get_password(passmaster_id: UUID, key: str, db: Session = Depends(get_db)):
    crypto = Crypto(key)
    
    # Query the database for the PassMaster object with the given website
    passmaster_record = db.query(PassMaster).filter(
        PassMaster.id == passmaster_id).first()

    # If the PassMaster object is not found, raise an HTTPException
    if passmaster_record is None:
        raise HTTPException(status_code=404, detail="Password record not found")

    # Decrypt the password using the generated key
    decrypted_password = crypto.decrypt(passmaster_record.encrypted_password)

    # Create a new PassMasterOutput object with the decrypted password
    passmaster_output = PassMasterOutput(
        id=passmaster_record.id,
        website=passmaster_record.website,
        email=passmaster_record.email,
        username=passmaster_record.username,
        encrypted_password=decrypted_password
    )

    # Return the PassMasterOutput object
    return passmaster_output

# UPDATE PASSWORD


@router.put("/update_password/{passmaster_id}", response_model=PassMasterOutput, status_code=200)
def update_password(
    passmaster_id: UUID,
    key: str,
    password_data: PasswordInput,
    db: Session = Depends(get_db)
):
    crypto = Crypto(key)

    # Query the database for the PassMaster object with the given ID
    passmaster_record = db.query(PassMaster).filter(
        PassMaster.id == passmaster_id).first()

    # If the PassMaster object is not found, raise an HTTPException
    if passmaster_record is None:
        raise HTTPException(status_code=404, detail="Password record not found")

    # Update the PassMaster object with the new data
    passmaster_record.website = password_data.website
    passmaster_record.email = password_data.email
    passmaster_record.username = password_data.username

    # Encrypt the new password using the generated key
    encrypted_password = crypto.encrypt(password_data.password)

    # Update the encrypted password in the PassMaster object
    passmaster_record.encrypted_password = encrypted_password

    # Commit the changes to the database
    db.commit()

    # Return the updated PassMaster object
    return PassMasterOutput.from_orm(passmaster_record)

@router.delete("/delete_password/{passmaster_id}")
def delete_password(passmaster_id: UUID, db: Session = Depends(get_db)):
    # Query the database for the PassMaster object with the given ID
    passmaster_record = db.query(PassMaster).filter(
        PassMaster.id == passmaster_id).first()

    # If the PassMaster object is not found, raise an HTTPException
    if passmaster_record is None:
        raise HTTPException(status_code=404, detail="Password record not found")

    # Delete the PassMaster object from the database
    db.delete(passmaster_record)
    db.commit()

    # Return a message indicating that the record was deleted
    return {"message": f"Password record with id {passmaster_id} has been deleted."}

