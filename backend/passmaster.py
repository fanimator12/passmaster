from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import PassMaster, Token as TokenModel, User as UserModel 
from typing import List
from cryptography.fernet import Fernet
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from settings import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM
from context import pwd_context, oauth2_scheme
from jose import JWTError, jwt
from schemas import (
    User, UserIn, UserInDB, PasswordInput,
    PassMasterOutput, Token
)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
  
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)
    
def authenticate_user(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta or None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_token(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == email).first()
    
    if user and pwd_context.verify(password, user.hashed_password):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": user.email, "key": user.key}, expires_delta=access_token_expires)
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    key: str = SECRET_KEY
):
    credential_exception = HTTPException(status_code=401, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, key, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credential_exception
    except JWTError:
         raise credential_exception
    user = db.query(UserModel).filter(UserModel.username == username).first()
    if user is None:
        raise credential_exception
    return user

# CREATE NEW USER

@router.post("/register", response_model=UserInDB, status_code=200)
async def create_user(user: UserIn, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = db.query(UserModel).filter(UserModel.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    hashed_password = pwd_context.hash(user.password)
    db_user = UserModel(username=user.username, email=user.email, fullname=user.fullname, hashed_password=hashed_password) 
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return UserInDB(user_id=db_user.id, username=db_user.username, email=db_user.email, fullname=user.fullname, hashed_password=hashed_password)

# TOKEN FOR USER

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    else:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
        return Token(access_token=access_token, token_type="bearer")

# GET USER
  
@router.get("/user", response_model=User)
async def get_user(current_user: User = Depends(get_current_user)):
    return current_user

    
# GET ALL PASSWORDS

@router.get("/get_all_passwords", response_model=List[PassMasterOutput])
async def get_all_passwords(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    passmasters = db.query(PassMaster).filter(PassMaster.user_id == current_user.id).all()
    passmasters_output = []

    for passmaster in passmasters:
        decrypted_password = current_user.aes_cipher.decrypt(passmaster.encrypted_password)

        passmaster_output = PassMasterOutput(
            id=passmaster.id,
            website=passmaster.website,
            email=passmaster.email,
            username=passmaster.username,
            encrypted_password=passmaster.encrypted_password,
            decrypted_password=decrypted_password 
        )

        passmasters_output.append(passmaster_output)

    return passmasters_output

# SAVE PASSWORD


@router.post("/save_password", response_model=PassMasterOutput, status_code=200)
async def save_password(password_data: PasswordInput, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    new_passmaster = PassMaster(
        website=password_data.website,
        email=password_data.email,
        username=password_data.username,
        user_id=current_user.id
    )

    new_passmaster.encrypt_password(password_data.password)

    db.add(new_passmaster)
    db.commit()
    db.refresh(new_passmaster)

    return PassMasterOutput(
        id=new_passmaster.id,
        website=new_passmaster.website,
        email=new_passmaster.email,
        username=new_passmaster.username,
        encrypted_password=new_passmaster.encrypted_password
    )

# GET PASSWORD


@router.get("/get_password/{passmaster_id}", response_model=PassMasterOutput, status_code=200)
async def get_password(passmaster_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    passmaster_record = db.query(PassMaster).filter(
        PassMaster.id == passmaster_id, PassMaster.user_id == current_user.id
    ).first()

    if passmaster_record is None:
        raise HTTPException(status_code=404, detail="Password record not found")

    decrypted_password = current_user.crypto.decrypt(passmaster_record.encrypted_password)

    passmaster_output = PassMasterOutput(
        id=passmaster_record.id,
        website=passmaster_record.website,
        email=passmaster_record.email,
        username=passmaster_record.username,
        encrypted_password=decrypted_password
    )

    return passmaster_output

# UPDATE PASSWORD


@router.put("/update_password/{passmaster_id}", response_model=PassMasterOutput, status_code=200)
async def update_password(
    passmaster_id: UUID,
    password_data: PasswordInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    crypto = Crypto(current_user.key)

    passmaster_record = db.query(PassMaster).filter(
        PassMaster.id == passmaster_id, PassMaster.user_id == current_user.id
    ).first()

    if passmaster_record is None:
        raise HTTPException(status_code=404, detail="Password record not found")

    passmaster_record.website = password_data.website
    passmaster_record.email = password_data.email
    passmaster_record.username = password_data.username

    encrypted_password = crypto.encrypt(password_data.password)

    passmaster_record.encrypted_password = encrypted_password

    db.commit()

    return PassMasterOutput.from_orm(passmaster_record)

@router.delete("/delete_password/{passmaster_id}")
async def delete_password(
    passmaster_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    passmaster_record = db.query(PassMaster).filter(
        PassMaster.id == passmaster_id, PassMaster.user_id == current_user.id
    ).first()

    if passmaster_record is None:
        raise HTTPException(status_code=404, detail="Password record not found")

    db.delete(passmaster_record)
    db.commit()

    return {"message": f"Password record with id {passmaster_id} has been deleted."}

