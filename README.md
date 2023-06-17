# PassMaster - Password Manager
This project is made for SCP1 - IT Security and Cryptography in Practice course (VIA University College).

# Prerequisites 
Install [virtualenv](https://virtualenv.pypa.io/en/latest/installation.html).

# Run backend
1. `cd backend`
2. `python3 -m <your_virtual_env> venv`
3. `source <your_virtual_env>/bin/activate`
4. `docker-compose up -d`
5. `pip install -r requirements.txt`
6. `uvicorn main:app --reload`

Check the API locally on localhost:8000/docs.
Otherwise, the FastAPI is deployed on Google Kubernetes Engine (GKE) and can be accessed through this **[link](http://34.88.11.138:8000/docs)**.

# Run frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

# Apply migrations
1. `cd backend`
2. `alembic revision --autogenerate -m "<migration_name>"`
3. `alembic upgrade head`
In case manual changes were made in SQL: `alembic stamp head`, then do the steps again.

# Deploy Docker image
1. `cd backend`
2. `docker build -t gcr.io/passmaster-389912/passmaster-image:latest .`
3. Open Google Cloud SDK
4. `docker push gcr.io/passmaster-389912/passmaster-image:latest`

# Deploy services on Kubernetes cluster
1. Open Google Cloud SDK
2. `kubectl apply -f redis-deployment.yaml`
3. `kubectl apply -f redis-service.yaml`
4. `kubectl apply -f web-deployment.yaml`
5. `kubectl apply -f web-service.yaml`
6. `kubectl apply -f passmaster-pod.yaml`

# Deploy frontend
The site is deployed on **Vercel**, since it automatically assigns SSL certificates. It is available on **[passmaster.net](https://passmaster.net/)**.