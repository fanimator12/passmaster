from cryptography.fernet import Fernet
from typing import List, Dict
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
import models

def main():
    pwd = {
        "email": "114341354",
        "facebook": "wrgdft45",
        "youtube": "rwe6455#4",
        "twitter": "70ydf9s^&h"
    }

    pm = PassMaster()

app = FastAPI()

db = SessionLocal()

origins = [
    "http://localhost:8000",
    "localhost:8000",
    "http://localhost:5173",
    "localhost:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class PassMasterClass:
    def __init__(self):
        self.key = None
        self.pwd_file = None
        self.pwd_dict = {}

    def create_key(self, path):
        self.key = Fernet.generate_key()
        with open(path, 'wb') as f:
            f.write(self.key)

    def load_key(self, path):
        with open(path, 'rb') as f:
            self.key = f.read()

    def create_pwd_file(self, path, init_values=None):
        self.pwd_file = path

        if init_values is not None:
            for key, value in init_values.items():
                self.add_pwd(key, value)
    
    def load_pwd_file(self, path):
        self.pwd_file = path

        with open(path, 'r') as f:
            for line in f:
                site, encrypted = line.split(':')
                self.pwd_dict[site] = Fernet(self.key).decrypt(encrypted.encode()).decode()

    def add_pwd(self, site, pwd):
        self.pwd_dict[site] = pwd

        if self.pwd_file is not None:
            with open(self.pwd_file, 'a+') as f:
                encrypted = Fernet(self.key).encrypt(pwd.encode())
                f.write(site + ':' + encrypted.decode() + '\n')

    def get_pwd(self, site):
        return self.pwd_dict[site]

# Serializer

class PassMaster(BaseModel):
    key: None
    pwd_file: None
    pwd_dict: Dict[str, str]

    class Config:
        orm_mode = True

# CREATE NEW ITEM

@app.post("/passmaster", response_model=PassMaster, status_code=status.HTTP_201_CREATED)
def create_item(passmaster: PassMaster):
    new_panel = models.passmaster(
        id=passmaster.id,
        key=passmaster.key,
        pwd_file=passmaster.pwd_file,
        pwd_dict=passmaster.pwd_dict
    )

    db_item = db.query(models.passmaster).filter(
        models.passmaster.name == new_panel.name).first()

    if db_item is not None:
        raise HTTPException(
            status_code=400, detail="Control Panel already exists.")

    db.add(new_panel)
    db.commit()

    return new_panel

# GET ITEM


@app.get("/passmaster/{id}", response_model=PassMaster, status_code=status.HTTP_200_OK)
def get_item(id: int):
    item = db.query(models.PassMaster).filter(
        models.PassMaster.id == id).first()
    return item

# GET ALL ITEMS


@app.get("/passmaster", response_model=List[PassMaster], status_code=200)
def get_all_items():
    return db.query(models.PassMaster).all()

# UPDATE ITEM


@app.put("/passmaster/{id}", response_model=PassMaster, status_code=status.HTTP_200_OK)
def update_item(id: int, PassMaster: PassMaster):
    updated_item = db.query(models.PassMaster).filter(
        models.PassMaster.id == id).first()
    updated_item.key = PassMaster.key
    updated_item.pwd_file = PassMaster.pwd_file
    updated_item.pwd_dict = PassMaster.pwd_dict

    db.commit()

    return updated_item

# REMOVE EXISTING ITEM

@app.delete("/passmaster")
def delete_item(id: int):
    deleted_item = db.query(models.PassMaster).filter(
        models.PassMaster.id == id).first()

    if deleted_item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Item not found.")

    db.delete(deleted_item)
    db.commit()

    return deleted_item