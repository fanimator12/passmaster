from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "passmaster"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60