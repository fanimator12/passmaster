# PassMaster - Password Manager
This project is made for SCP1 - IT Security and Cryptography in Practice course (VIA University College).

# Prerequisites 
Install [virtualenv](https://virtualenv.pypa.io/en/latest/installation.html).

# Run backend
1. `cd backend`
2. `docker-compose up -d`
3. `python3 -m <your_virtual_env> venv`
4. `source <your_virtual_env>/bin/activate`
5. `pip install -r requirements.txt`
6. `uvicorn main:app --reload`

Check the API locally on localhost:8000/docs.
Otherwise, the FastAPI is deployed on Google Kubernetes Engine (GKE) and can be accessed through this **[link](http://34.88.205.92:8000/docs)**.

# Run frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`