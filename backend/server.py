# server.py
import whisper
from fastapi import FastAPI, UploadFile, File
import shutil

app = FastAPI()
model = whisper.load_model("base")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    with open("temp_audio.wav", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = model.transcribe("temp_audio.wav")
    return {"text": result["text"]}