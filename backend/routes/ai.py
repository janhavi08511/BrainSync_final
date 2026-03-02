import os
import requests
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/ai", tags=["AI"])

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
OCR_API_KEY = os.getenv("OCR_API_KEY")


# ====================================
# 🎤 Speech to Text (Deepgram API)
# ====================================
@router.post("/stt")
async def speech_to_text(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()

        url = "https://api.deepgram.com/v1/listen"

        headers = {
            "Authorization": f"Token {DEEPGRAM_API_KEY}",
            "Content-Type": file.content_type
        }

        response = requests.post(
            url,
            headers=headers,
            data=audio_bytes
        )

        result = response.json()

        transcript = (
            result["results"]["channels"][0]["alternatives"][0]["transcript"]
        )

        return {"text": transcript}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# ====================================
# 🖼 Image OCR (OCR.space API)
# ====================================
@router.post("/ocr")
async def image_ocr(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()

        url = "https://api.ocr.space/parse/image"

        files = {
            "file": (file.filename, image_bytes)
        }

        data = {
            "apikey": OCR_API_KEY,
            "language": "eng"
        }

        response = requests.post(url, files=files, data=data)

        result = response.json()

        if result.get("IsErroredOnProcessing"):
            return {"error": result.get("ErrorMessage")}

        parsed_results = result.get("ParsedResults")

        if not parsed_results:
            return {"text": ""}

        parsed_text = parsed_results[0].get("ParsedText", "")

        return {"text": parsed_text.strip()}

    except Exception as e:
        return {"error": str(e)}