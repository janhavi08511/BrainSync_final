from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application configuration from environment variables"""
    
    # MongoDB
    # must be provided via environment variable; no default value
    mongodb_url: str
    database_name: str = "brainsync"
    
    # JWT
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Server
    debug: bool = False
    api_prefix: str = "/api/v1"
    # Optionally use an in-memory DB (development only).
    # Set to false to require a real MongoDB server.
    use_in_memory_db: bool = False
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"  # permit additional env vars such as FRONTEND_URL, VITE_API_URL


settings = Settings()
