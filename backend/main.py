
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.phishing_routes import router as phishing_router
from routes.threat_routes import router as threat_router
from routes.response_routes import router as response_router
from routes.email_routes import router as email_router
from routes.message_routes import router as message_router
from routes.dashboard_routes import router as dashboard_router
from routes.auth_routes import router as auth_router
from routes.image_routes import router as image_router
from config.database import test_database_connection
from routes.voice_routes import router as voice_router


app = FastAPI(
    title="CYBERGUARD API",
    description="AI-Powered Cyber Threat, Phishing & Digital Impersonation Detection and Response System",
    version="1.0.0"
)


# ==============================
# DATABASE
# ==============================

test_database_connection()


# ==============================
# CORS
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# ROUTES
# ==============================

app.include_router(phishing_router)
app.include_router(threat_router)
app.include_router(response_router)
app.include_router(email_router)
app.include_router(message_router)
app.include_router(dashboard_router)
app.include_router(voice_router)

# Authentication routes
app.include_router(auth_router)
app.include_router(image_router)

# ==============================
# ROOT
# ==============================

@app.get("/")
def root():
    return {
        "message": "CYBERGUARD API is running successfully",
        "status": "online"
    }


# ==============================
# HEALTH
# ==============================

@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }

