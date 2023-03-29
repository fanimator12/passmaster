from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
from models import PassMaster
from typing import List, Optional
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
    id: UUID
    website: str
    email: str
    username: str
    encrypted_password: str

    class Config:
        orm_mode = True

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
        id=new_passmaster.id,
        website=new_passmaster.website,
        email=new_passmaster.email,
        username=new_passmaster.username,
        encrypted_password=new_passmaster.encrypted_password
    )

# GET PASSWORD


@router.get("/get_password", response_model=PassMasterOutput, status_code=200)
def get_password(passmaster_id: UUID, db: Session = Depends(get_db)):
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
    password_data: PasswordInput,
    db: Session = Depends(get_db)
):
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

