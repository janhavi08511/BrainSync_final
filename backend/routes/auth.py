from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from database import get_db
from security import get_password_hash, verify_password, create_access_token
from schemas.auth import SignupRequest, LoginRequest, AuthResponse
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse)
async def signup(user_data: SignupRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    users_collection = db["users"]
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed_pwd = get_password_hash(user_data.password)
    new_user = {
        "email": user_data.email,
        "hashed_password": hashed_pwd,
        "full_name": user_data.full_name,
        "language_preference": user_data.language_preference,
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    result = await users_collection.insert_one(new_user)
    token = create_access_token({"sub": str(result.inserted_id), "email": user_data.email})
    return AuthResponse(
        access_token=token,
        user={
            "id": str(result.inserted_id),
            "email": user_data.email,
            "full_name": user_data.full_name
        }
    )


@router.post("/login", response_model=AuthResponse)
async def login(credentials: LoginRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    users_collection = db["users"]
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    token = create_access_token({"sub": str(user["_id"]), "email": user["email"]})
    return AuthResponse(
        access_token=token,
        user={
            "id": str(user["_id"]),
            "email": user["email"],
            "full_name": user["full_name"]
        }
    )