# PassMaster - Password Manager
This project is made for SCP1 - IT Security and Cryptography in Practice course (VIA University College).

# Prerequisites 
Install [virtualenv](https://virtualenv.pypa.io/en/latest/installation.html).

# Run backend
1. `cd backend`
3. `python3 -m <your_virtual_env> venv`
4. `source <your_virtual_env>/bin/activate`
5. `pip install -r requirements.txt`
6. `uvicorn main:app --reload`
(I will run on http://127.0.0.1:8000/docs)

# Run frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`