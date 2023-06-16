from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Security
from sqlalchemy.orm import Session
from database import SessionLocal
from models import PassMaster, Token, User as UserModel, Key
from typing import List
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_limiter.depends import RateLimiter
from datetime import timedelta, datetime
from settings import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM
from context import pwd_context, oauth2_scheme
from jose import JWTError, jwt
from schemas import User, UserIn, UserInDB, PasswordInput, PassMasterOutput, Token
from cryptography.fernet import Fernet
import time
import redis
from pyotp import TOTP, random_base32

r = redis.Redis(host="passmaster-redis", port=6379, db=0)
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


def create_access_token(data: dict, expires_delta: timedelta or None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_token(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == username).first()

    if user and verify_password(password, user.hashed_password):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    key: str = SECRET_KEY,
):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
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


@router.post("/register", response_model=UserInDB, status_code=status.HTTP_200_OK)
async def create_user(user: UserIn, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = db.query(UserModel).filter(UserModel.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = pwd_context.hash(user.password)
    totp_secret = random_base32()

    db_user = UserModel(
        username=user.username,
        email=user.email,
        fullname=user.fullname,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # 2FA Authentication
    totp = TOTP(totp_secret)
    qr_code = totp.provisioning_uri(user.email, issuer_name="PassMaster")

    return UserInDB(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email,
        fullname=user.fullname,
        hashed_password=hashed_password,
        qr_code=qr_code,
    )


# GET TOTP QR CODE & TOKEN


@router.get("/totp/{username}")
async def get_totp_secret(username: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    totp = TOTP(user.totp_secret)
    totp_token = totp.now()

    qr_code = totp.provisioning_uri(user.email, issuer_name="PassMaster")

    return {"qr_code": qr_code, "totp_token": totp_token}


# VERIFY TOTP TOKEN


@router.post(
    "/verify_totp/{username}",
    dependencies=[Depends(RateLimiter(times=5, minutes=5))],
    response_model=Token,
)
def verify_totp(username: str, totp_token: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == username).first()
    if not user:
        raise HTTPException(status_code=400, detail="User does not exist")

    user_attempt_key = f"user:{user.username}:attempts"
    totp = TOTP(user.totp_secret)

    if not totp_token or not totp.verify(totp_token):
        # in case of fail, increment attempt count
        r.incr(user_attempt_key, 1)
        r.expire(user_attempt_key, 60)
        raise HTTPException(status_code=400, detail="Invalid TOTP token")

    # in case of success, reset attempt count
    r.set(user_attempt_key, 0)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")


# JWT TOKEN FOR USER


@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(UserModel).filter(UserModel.username == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    user_attempt_key = f"user:{user.username}:attempts"

    # in case of exceed limit, let it reset after 5 min
    if r.exists(user_attempt_key) and int(r.get(user_attempt_key)) >= 3:
        time.sleep(300)
        r.set(user_attempt_key, 0)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")


@router.get("/protected_endpoint", dependencies=[Depends(oauth2_scheme)])
def protected_endpoint(token: str = Security(oauth2_scheme)):
    return {"message": "Access granted"}


# GET USER


@router.get("/user", response_model=User)
async def get_user(current_user: UserModel = Depends(get_current_user)):
    return User(
        username=current_user.username,
        email=current_user.email,
        fullname=current_user.fullname,
    )


# GET ALL PASSWORDS


@router.get("/get_all_passwords", response_model=List[PassMasterOutput])
async def get_all_passwords(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    passmasters = (
        db.query(PassMaster).filter(PassMaster.user_id == current_user.id).all()
    )
    passmasters_output = []

    for passmaster in passmasters:
        passmaster_output = PassMasterOutput(
            id=passmaster.id,
            website=passmaster.website,
            email=passmaster.email,
            username=passmaster.username,
            encrypted_password=passmaster.encrypted_password,
        )

        passmasters_output.append(passmaster_output)

    return passmasters_output


# SAVE PASSWORD


@router.post(
    "/save_password", response_model=PassMasterOutput, status_code=status.HTTP_200_OK
)
async def save_password(
    password_data: PasswordInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    key = Fernet.generate_key()
    new_key = Key(aes_key=key.decode(), user_id=current_user.id)

    db.add(new_key)
    db.commit()
    db.refresh(new_key)

    new_passmaster = PassMaster(
        website=password_data.website,
        email=password_data.email,
        username=password_data.username,
        user_id=current_user.id,
        key=new_key,
    )

    new_passmaster.encrypt_password(password_data.password, new_key.aes_key)

    print(
        f"Encrypted password before saving: {new_passmaster.encrypted_password}"
    )  # Debug print

    db.add(new_passmaster)
    db.flush()
    db.commit()
    db.refresh(new_passmaster)

    return PassMasterOutput(
        id=new_passmaster.id,
        website=new_passmaster.website,
        email=new_passmaster.email,
        username=new_passmaster.username,
        encrypted_password=new_passmaster.encrypted_password,
    )


# GET PASSWORD


@router.get(
    "/get_password/{passmaster_id}",
    response_model=PassMasterOutput,
    status_code=status.HTTP_200_OK,
)
async def get_password(
    passmaster_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    passmaster_record = (
        db.query(PassMaster)
        .filter(PassMaster.id == passmaster_id, PassMaster.user_id == current_user.id)
        .first()
    )

    if passmaster_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Password record not found"
        )

    if passmaster_record.key_id is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password record is corrupted: missing key",
        )

    decrypted_password = passmaster_record.get_decrypted_password(
        passmaster_record.key.aes_key
    )

    passmaster_output = PassMasterOutput(
        id=passmaster_record.id,
        website=passmaster_record.website,
        email=passmaster_record.email,
        username=passmaster_record.username,
        encrypted_password=decrypted_password,
    )

    return passmaster_output


# UPDATE PASSWORD


@router.put(
    "/update_password/{passmaster_id}",
    response_model=PassMasterOutput,
    status_code=status.HTTP_200_OK,
)
async def update_password(
    passmaster_id: UUID,
    password_data: PasswordInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    passmaster_record = (
        db.query(PassMaster)
        .filter(PassMaster.id == passmaster_id, PassMaster.user_id == current_user.id)
        .first()
    )

    if passmaster_record.key_id is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password record is corrupted: missing key",
        )

    key = passmaster_record.key.aes_key

    if password_data.website is not None:
        passmaster_record.website = password_data.website

    if password_data.email is not None:
        passmaster_record.email = password_data.email

    if password_data.username is not None:
        passmaster_record.username = password_data.username

    if password_data.password is not None:
        encrypted_password = passmaster_record.encrypt_password(password_data.password, key)
        passmaster_record.encrypted_password = encrypted_password

    db.add(passmaster_record)
    db.commit()
    db.refresh(passmaster_record)

    return PassMasterOutput.from_orm(passmaster_record)


@router.delete("/delete_password/{passmaster_id}")
async def delete_password(
    passmaster_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    passmaster_record = (
        db.query(PassMaster)
        .filter(PassMaster.id == passmaster_id, PassMaster.user_id == current_user.id)
        .first()
    )

    if passmaster_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Password record not found"
        )

    db.delete(passmaster_record)
    db.commit()

    return {"message": f"Password record with id {passmaster_id} has been deleted."}
