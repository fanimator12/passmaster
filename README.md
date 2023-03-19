# PassMaster - Password Manager
This project is made for SCP1 - IT Security and Cryptography in Practice course (VIA University College).

# Run backend
1. `cd server`
2. activate your virtual environment (first install `python3 -m <your_virtual_env> venv`, then type: `source <your_virtual_env>/bin/activate`)
3. `pip install -r requirements.txt`
4. `python create_db.py`
5. `uvicorn main:app --reload`

# Run frontend
1. `cd frontend`
2. `npm install`
3. `npm start`