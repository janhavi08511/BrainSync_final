from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings
from database import connect_db, close_db
from routes import auth, translations
from dotenv import load_dotenv
import os

load_dotenv()
import logging


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    # Startup
    await connect_db()
    yield
    # Shutdown
    await close_db()


# ✅ Create FastAPI app FIRST
app = FastAPI(
    title="BrainSync API",
    description="Backend API for BrainSync translation service",
    version="1.0.0",
    lifespan=lifespan
)
from routes.ai import router as ai_router
app.include_router(ai_router)

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "https://brainsync-final.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ Include routers AFTER app is created
app.include_router(auth.router)
app.include_router(translations.router)
app.include_router(ai_router)   # 🔥 AI routes added here


@app.get("/")
async def root():
    return {
        "message": "Welcome to BrainSync API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )