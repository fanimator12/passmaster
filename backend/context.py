from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/passmaster/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")