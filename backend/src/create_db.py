from database import Base, engine
from models import PassMaster

print("Creating database ...")

Base.metadata.create_all(engine)