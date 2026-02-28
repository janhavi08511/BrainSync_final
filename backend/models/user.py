from pymongo import MongoClient
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from bson import ObjectId


class User(BaseModel):
    """User model for MongoDB"""
    email: EmailStr
    hashed_password: str
    full_name: str
    language_preference: Optional[str] = "en"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class UserInDB(User):
    """User as stored in database with MongoDB ID"""
    id: Optional[str] = Field(alias="_id")
    
    class Config:
        populate_by_name = True
