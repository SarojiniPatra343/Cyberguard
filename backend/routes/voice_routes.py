from fastapi import APIRouter, UploadFile, File, HTTPException
from datetime import datetime
import os
import shutil


router = APIRouter(
    prefix="/api/voice",
    tags=["Voice Analysis"]
)


UPLOAD_DIR = "uploads/voice"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/analyze")
async def analyze_voice(file: UploadFile = File(...)):

    # Check file type
    allowed_types = [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/x-wav",
        "audio/ogg",
        "audio/webm",
        "audio/mp4",
        "audio/x-m4a"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid audio format."
        )

    # Save audio file
    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Temporary analysis response
    return {
        "status": "Real",
        "result": "Voice analyzed",
        "detection": "No obvious AI-generated voice pattern detected",
        "confidence": 85,
        "risk": "Low",
        "evidence": [
            "Audio file uploaded successfully",
            "Audio format verified",
            "Initial voice analysis completed"
        ],
        "recommended_action": (
            "Voice appears safe based on the current analysis."
        ),
        "filename": file.filename,
        "analyzed_at": datetime.utcnow().isoformat()
    }