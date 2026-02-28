from pydantic import BaseModel, Field
from typing import Optional


class TranslationCreate(BaseModel):
    """Create translation request"""
    source_text: Optional[str] = None
    source_language: str = "en"
    target_language: str = "hi"
    translated_text: Optional[str] = None
    translation_type: str  # "text", "audio", "image"
    audio_file_url: Optional[str] = None
    image_file_url: Optional[str] = None


class TranslationUpdate(BaseModel):
    """Update translation request"""
    translated_text: Optional[str] = None
    braille_output: Optional[str] = None
    target_language: Optional[str] = None


class TranslationResponse(BaseModel):
    """Translation response"""
    id: str
    source_text: Optional[str]
    source_language: str
    target_language: str
    translated_text: Optional[str]
    braille_output: Optional[str]
    audio_file_url: Optional[str]
    image_file_url: Optional[str]
    translation_type: str
    created_at: str
    updated_at: str
