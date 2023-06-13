from fastapi import FastAPI
from passmaster import router as passmaster_app
from fastapi.middleware.cors import CORSMiddleware

CORS_CONFIG = {
    "allow_origins": ["*"],
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

origins = [
    "http://localhost:8000",
    "localhost:8000",
    "http://localhost:5432",
    "localhost:5432"
]

app = FastAPI()

app.include_router(passmaster_app, prefix="/passmaster")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_CONFIG["allow_origins"],
    allow_credentials=CORS_CONFIG["allow_credentials"],
    allow_methods=CORS_CONFIG["allow_methods"],
    allow_headers=CORS_CONFIG["allow_headers"]
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)