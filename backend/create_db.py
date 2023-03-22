from database import Base, engine
import models

print("Creating database ...")

Base.metadata.create_all(engine)