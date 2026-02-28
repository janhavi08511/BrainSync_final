from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from database import get_db
from schemas.translation import TranslationCreate, TranslationUpdate, TranslationResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List

router = APIRouter(prefix="/translations", tags=["translations"])


@router.post("/", response_model=TranslationResponse)
async def create_translation(data: TranslationCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    translations_collection = db["translations"]
    translation = {
        "user_id": "current_user_id",  # TODO: Get from auth token
        "source_text": data.source_text,
        "source_language": data.source_language,
        "target_language": data.target_language,
        "translated_text": data.translated_text,
        "audio_file_url": data.audio_file_url,
        "image_file_url": data.image_file_url,
        "braille_output": None,
        "translation_type": data.translation_type,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    result = await translations_collection.insert_one(translation)
    return _format_translation({**translation, "_id": result.inserted_id})


@router.get("/", response_model=List[TranslationResponse])
async def get_history(
    limit: int = 50,
    search: str | None = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    translations_collection = db["translations"]
    query = {}
    if search:
        # case-insensitive regex search on text fields
        query = {
            "$or": [
                {"source_text": {"$regex": search, "$options": "i"}},
                {"braille_output": {"$regex": search, "$options": "i"}},
            ]
        }
    cursor = translations_collection.find(query).sort("created_at", -1)
    translations = await cursor.to_list(length=limit if limit and limit > 0 else 0)
    return [_format_translation(t) for t in translations]


@router.delete("/{translation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_translation(
    translation_id: str, db: AsyncIOMotorDatabase = Depends(get_db)
):
    translations_collection = db["translations"]
    result = await translations_collection.delete_one({"_id": ObjectId(translation_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Translation not found")
    return


@router.get("/stats")
async def get_stats(db: AsyncIOMotorDatabase = Depends(get_db)):
    translations_collection = db["translations"]
    total = await translations_collection.count_documents({})
    pipeline = [
        {"$group": {"_id": "$translation_type", "count": {"$sum": 1}}}
    ]
    stats_cursor = translations_collection.aggregate(pipeline)
    counts = {"text": 0, "image": 0, "audio": 0, "microphone": 0, "file": 0, "braille": 0}
    async for doc in stats_cursor:
        counts[doc["_id"]] = doc["count"]
    return {"total": total, "byMethod": counts}


def _format_translation(doc: dict) -> TranslationResponse:
    """Format MongoDB document to response model"""
    return TranslationResponse(
        id=str(doc["_id"]),
        source_text=doc.get("source_text"),
        source_language=doc.get("source_language", "en"),
        target_language=doc.get("target_language", "hi"),
        translated_text=doc.get("translated_text"),
        braille_output=doc.get("braille_output"),
        audio_file_url=doc.get("audio_file_url"),
        image_file_url=doc.get("image_file_url"),
        translation_type=doc.get("translation_type"),
        created_at=doc.get("created_at").isoformat() if doc.get("created_at") else None,
        updated_at=doc.get("updated_at").isoformat() if doc.get("updated_at") else None
    )