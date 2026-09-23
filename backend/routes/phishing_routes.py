from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.phishing_detector import detect_phishing
from config.database import threats_collection
from models.threat_model import create_threat_document


router = APIRouter(
    prefix="/api/phishing",
    tags=["Phishing Detection"]
)


class PhishingRequest(BaseModel):
    url: str


@router.post("/detect")
def phishing_detection(request: PhishingRequest):

    url = request.url.strip()

    if not url:
        raise HTTPException(
            status_code=400,
            detail="Please provide a URL"
        )

    # Run phishing detection
    result = detect_phishing(url)

    # Recommended action
    if result["is_phishing"]:
        recommended_action = (
            "Block this URL and avoid entering personal information."
        )
    else:
        recommended_action = (
            "URL appears safe, but continue to use normal security precautions."
        )

    # Create MongoDB document
    threat_document = create_threat_document(
        input_value=url,
        input_type="URL",
        threat_type="Phishing",
        risk=result["risk"],
        risk_score=result["score"],
        confidence=result["confidence"],
        is_threat=result["is_phishing"],
        evidence=result["reasons"],
        recommended_action=recommended_action
    )

    # Save result to MongoDB
    try:

        inserted = threats_collection.insert_one(
            threat_document
        )

    except Exception as e:

        print("MongoDB save error:", e)

        raise HTTPException(
            status_code=500,
            detail=(
                "Phishing detection completed "
                "but result could not be saved to database"
            )
        )

    # Return result to frontend
    return {
        "url": url,
        "risk": result["risk"],
        "score": result["score"],
        "confidence": result["confidence"],
        "is_phishing": result["is_phishing"],
        "reasons": result["reasons"],
        "recommended_action": recommended_action,
        "database_id": str(inserted.inserted_id)
    }