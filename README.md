# PassMaster - Password Manager
This project is made for SCP1 - IT Security and Cryptography in Practice course (VIA University College).

# Prerequisites 
Install [virtualenv](https://virtualenv.pypa.io/en/latest/installation.html).

# Build & Run Docker image locally
1. `pip install docker-compose`
2. `docker build --tag fastapi-demo .`
3. `docker run --detach --publish 3100:3100 fastapi-demo`

# Run backend
1. `cd backend`
3. `python3 -m <your_virtual_env> venv`
4. `source <your_virtual_env>/bin/activate`
5. `pip install -r requirements.txt`
6. `uvicorn main:app --reload`

# Run frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`