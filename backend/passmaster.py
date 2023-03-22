from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
from models import PassMaster
from typing import Optional
from cryptography.fernet import Fernet

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class PasswordInput(BaseModel):
    website: str
    email: Optional[str]
    username: Optional[str]
    password: str


class PassMasterOutput(BaseModel):
    website: str
    email: str
    username: str
    encrypted_password: str


class Crypto:
    def __init__(self):
        self.key = self.load_key()
        print(self.key)

    def load_key(self):
        try:
            with open("crypto_key.txt", "r") as key_file:
                key = key_file.read()
                return key.encode()
        except FileNotFoundError:
            new_key = Fernet.generate_key()
            with open("crypto_key.txt", "w") as key_file:
                key_file.write(new_key.decode())
            return new_key
    
    def encrypt(self, message):
        f = Fernet(self.key)
        encrypted = f.encrypt(message.encode())
        return encrypted.decode()

    def decrypt(self, ciphertext):
        f = Fernet(self.key)
        print(self.key)
        decrypted = f.decrypt(ciphertext.encode())
        return decrypted.decode()


crypto = Crypto()


@router.post("/save_password", response_model=PassMasterOutput)
def save_password(password_data: PasswordInput, db: Session = Depends(get_db)):
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
        website=new_passmaster.website,
        email=new_passmaster.email,
        username=new_passmaster.username,
        encrypted_password=new_passmaster.encrypted_password
    )


@router.get("/get_password", response_model=PassMasterOutput)
def get_password(website: str = Query(..., description="The website to search for"), db: Session = Depends(get_db)):
    # Query the database for the PassMaster object with the given website
    passmaster_record = db.query(PassMaster).filter(PassMaster.website == website).first()

    # If the PassMaster object is not found, raise an HTTPException
    if passmaster_record is None:
        raise HTTPException(status_code=404, detail="Website not found")

    # Decrypt the password using the generated key
    decrypted_password = crypto.decrypt(passmaster_record.encrypted_password)

    # Create a new PassMasterOutput object with the decrypted password
    passmaster_output = PassMasterOutput(
        website=passmaster_record.website,
        email=passmaster_record.email,
        username=passmaster_record.username,
        encrypted_password=decrypted_password
    )

    # Return the PassMasterOutput object
    return passmaster_output
