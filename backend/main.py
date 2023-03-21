from cryptography.fernet import Fernet
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from config import CORS_CONFIG
from dependencies import login_for_access_token
from database import SessionLocal
from serializers import Token, PassMaster
from uuid import UUID, uuid4

app = FastAPI()

db = SessionLocal()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_CONFIG["allow_origins"],
    allow_credentials=CORS_CONFIG["allow_credentials"],
    allow_methods=CORS_CONFIG["allow_methods"],
    allow_headers=CORS_CONFIG["allow_headers"]
)

# CREATE TOKEN


@app.post("/token", response_model=Token)
async def get_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    return await login_for_access_token(form_data)

# CREATE NEW PASS MANAGER


@app.post("/passmaster", response_model=PassMaster, status_code=status.HTTP_201_CREATED)
def create_pass_manager(passmaster: PassMaster):

    passmaster.id = uuid4()
    
    new_pass_manager = PassMaster(
        id=passmaster.id,
        key=passmaster.key,
        pwd_dict=passmaster.pwd_dict
    )

    db_item = db.query(PassMaster).filter(
        PassMaster.id == new_pass_manager.id).first()

    if db_item is not None:
        raise HTTPException(
            status_code=400, detail="This Password Manager already exists.")

    db.add(new_pass_manager)
    db.commit()

    return new_pass_manager

# ADD PASSWORD


@app.post("/passmaster/{id}/add_pwd", status_code=status.HTTP_200_OK)
def add_pwd(id: UUID, site: str, pwd: str):
    passmaster = db.query(PassMaster).filter(
        PassMaster.id == id).first()

    if passmaster is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Password Manager not found.")

    fernet = Fernet(passmaster.key)
    encrypted = fernet.encrypt(pwd.encode())
    passmaster.pwd_dict[site] = encrypted.decode()

    db.commit()

    return {"detail": "Password added."}

# GET PASSWORD


@app.get("/passmaster/{id}/get_pwd/{site}", status_code=status.HTTP_200_OK)
def get_pwd(id: UUID, site: str):
    passmaster = db.query(PassMaster).filter(
        PassMaster.id == id).first()

    if passmaster is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Password Manager not found.")

    encrypted = passmaster.pwd_dict.get(site)

    if encrypted is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Site not found in PassMaster.")

    fernet = Fernet(passmaster.key)
    decrypted = fernet.decrypt(encrypted.encode()).decode()

    return {"password": decrypted}

# DELETE PASSWORD


@app.delete("/passmaster/{id}/delete_pwd/{site}", status_code=status.HTTP_200_OK)
def delete_pwd(id: UUID, site: str):
    passmaster = db.query(PassMaster).filter(
        PassMaster.id == id).first()

    if passmaster is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Password Manager not found.")

    if site not in passmaster.pwd_dict:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Site not found in PassMaster.")

    del passmaster.pwd_dict[site]

    db.commit()

    return {"detail": "Password deleted."}

# GET PASS MANAGER


@app.get("/passmaster/{id}", response_model=PassMaster, status_code=status.HTTP_200_OK)
def get_pass_manager(id: UUID):
    pass_manager = db.query(PassMaster).filter(
        PassMaster.id == id).first()
    return pass_manager

# GET ALL PASS MANAGERS


@app.get("/passmaster", response_model=List[PassMaster], status_code=status.HTTP_200_OK)
def get_all_pass_managers():
    return db.query(PassMaster).all()

# UPDATE PASS MANAGER


@app.put("/passmaster/{id}", response_model=PassMaster, status_code=status.HTTP_200_OK)
def update_pass_manager(id: UUID, passmaster_update: PassMaster):
    passmaster = db.query(PassMaster).filter(
        PassMaster.id == id).first()

    if passmaster is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Password Manager not found.")

    passmaster.key = passmaster_update.key
    passmaster.pwd_dict = passmaster_update.pwd_dict

    db.commit()

    return passmaster

# REMOVE EXISTING PASS MANAGER


@app.delete("/passmaster/{id}", status_code=status.HTTP_200_OK)
def delete_pass_manager(id: UUID):
    passmaster = db.query(PassMaster).filter(
        PassMaster.id == id).first()

    if passmaster is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Password Manager not found.")

    db.delete(passmaster)
    db.commit()

    return {"detail": "Password Manager deleted."}
