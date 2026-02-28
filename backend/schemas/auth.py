from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class SignupRequest(BaseModel):
    """User signup request"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=1)
    language_preference: Optional[str] = "en"


class LoginRequest(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """Authentication response with token"""
    access_token: str
    token_type: str = "bearer"
    user: dict


class PasswordChangeRequest(BaseModel):
    """Password change request"""
    old_password: str
    new_password: str = Field(..., min_length=8)
