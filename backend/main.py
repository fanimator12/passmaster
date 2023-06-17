from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.openapi.docs import get_swagger_ui_html
from passmaster import router as passmaster_app
from fastapi.middleware.cors import CORSMiddleware
from aioredis import from_url
from aioredis.client import Redis
from fastapi_limiter import FastAPILimiter

CORS_CONFIG = {
    "allow_origins": ["*"],
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

origins = ["*"]

app = FastAPI()

redis: Redis = None

@app.on_event("startup")
async def startup_event():
    global redis
    redis = await from_url("redis://passmaster-redis:6379/0")
    await FastAPILimiter.init(redis)

app.include_router(passmaster_app, prefix="/passmaster")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_CONFIG["allow_origins"],
    allow_credentials=CORS_CONFIG["allow_credentials"],
    allow_methods=CORS_CONFIG["allow_methods"],
    allow_headers=CORS_CONFIG["allow_headers"]
)

@app.get("/docs", include_in_schema=False)
async def get_documentation():
    return get_swagger_ui_html(openapi_url="/openapi.json", title="API Documentation")

@app.get("/openapi.json", include_in_schema=False)
def get_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="API Documentation",
        version="1.0.0",
        description="This is the API documentation for the application.",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
