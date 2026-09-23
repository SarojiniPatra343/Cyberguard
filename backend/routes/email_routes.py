from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.email_analyzer import analyze_email
from config.database import threats_collection
from models.threat_model import create_threat_document


router = APIRouter(
    prefix="/api/email",
    tags=["Email Phishing Detection"]
)


class EmailRequest(BaseModel):
    email: str


@router.post("/analyze")
def email_analysis(request: EmailRequest):

    email = request.email.strip()

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Please provide email content"
        )

    # Analyze email
    result = analyze_email(email)

    # Recommended action
    if result["is_phishing"]:

        recommended_action = (
            "Do not click links, open attachments, "
            "or provide credentials. Report the email."
        )

    elif result["risk"] in ["LOW", "MEDIUM"]:

        recommended_action = (
            "Review the email carefully before "
            "clicking links or sharing information."
        )

    else:

        recommended_action = (
            "No immediate action required. "
            "Continue normal security precautions."
        )

    # Create MongoDB document
    threat_document = create_threat_document(

        input_value=email,

        input_type="EMAIL",

        threat_type="Email Phishing",

        risk=result["risk"],

        risk_score=result["score"],

        confidence=result["confidence"],

        is_threat=result["is_phishing"],

        evidence=result["reasons"],

        recommended_action=recommended_action
    )

    # Save to MongoDB
    try:

        inserted = threats_collection.insert_one(
            threat_document
        )

    except Exception as e:

        print("MongoDB email save error:", e)

        raise HTTPException(
            status_code=500,
            detail=(
                "Email analysis completed but "
                "result could not be saved to database"
            )
        )

    return {

        "email": email,

        "risk": result["risk"],

        "score": result["score"],

        "confidence": result["confidence"],

        "is_phishing": result["is_phishing"],

        "reasons": result["reasons"],

        "recommended_action": recommended_action,

        "database_id": str(
            inserted.inserted_id
        )
    }