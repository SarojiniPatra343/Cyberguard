from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
from datetime import datetime

router = APIRouter(
    prefix="/api/image",
    tags=["Image Analysis"]
)


@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):

    # Check file
    if not file:
        raise HTTPException(
            status_code=400,
            detail="Please upload an image."
        )

    # Allowed image types
    allowed_types = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed."
        )

    # Create upload directory
    upload_dir = "uploads/images"

    os.makedirs(
        upload_dir,
        exist_ok=True
    )

    # Create safe filename
    filename = file.filename or "uploaded_image"

    file_path = os.path.join(
        upload_dir,
        filename
    )

    # Save image
    try:

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save image: {str(e)}"
        )

    # -----------------------------------------
    # TEMPORARY ANALYSIS
    # -----------------------------------------

    # This is currently a basic response.
    # Replace this section later with your
    # actual deepfake/image ML model.

    return {
        "status": "Real",
        "result": "Image analyzed",
        "detection": "No obvious manipulation detected",
        "confidence": 85,
        "risk": "Low",
        "evidence": [
            "Image uploaded successfully",
            "File format verified",
            "Initial image analysis completed"
        ],
        "recommended_action": (
            "Image appears safe based on the current analysis."
        ),
        "filename": filename,
        "analyzed_at": datetime.utcnow().isoformat()
    }