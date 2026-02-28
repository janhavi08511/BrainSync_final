from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class Translation(BaseModel):
    """Translation model for MongoDB"""
    user_id: str
    source_text: Optional[str] = None
    source_language: str = "en"
    target_language: str = "hi"
    translated_text: Optional[str] = None
    audio_file_url: Optional[str] = None
    image_file_url: Optional[str] = None
    braille_output: Optional[str] = None
    translation_type: str  # "text", "audio", "image"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class TranslationInDB(Translation):
    """Translation as stored in database with MongoDB ID"""
    id: Optional[str] = Field(alias="_id")
    
    class Config:
        populate_by_name = True
