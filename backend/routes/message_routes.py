from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.message_analyzer import analyze_message

from config.database import threats_collection

from models.threat_model import create_threat_document


router = APIRouter(
    prefix="/api/message",
    tags=["Message Social Engineering Detection"]
)


class MessageRequest(BaseModel):

    message: str


@router.post("/analyze")
def message_analysis(request: MessageRequest):

    message = request.message.strip()

    if not message:

        raise HTTPException(
            status_code=400,
            detail="Please provide a message"
        )


    result = analyze_message(message)


    if result["is_threat"]:

        recommended_action = (
            "Do not click links or share passwords, OTPs, "
            "PINs, or financial information. Report the message."
        )

    elif result["risk"] in ["LOW", "MEDIUM"]:

        recommended_action = (
            "Review the message carefully before responding "
            "or sharing personal information."
        )

    else:

        recommended_action = (
            "No immediate action required. "
            "Continue normal security precautions."
        )


    # ==============================
    # SAVE TO MONGODB
    # ==============================

    threat_document = create_threat_document(

        input_value=message,

        input_type="MESSAGE",

        threat_type="Social Engineering",

        risk=result["risk"],

        risk_score=result["score"],

        confidence=result["confidence"],

        is_threat=result["is_threat"],

        evidence=result["reasons"],

        recommended_action=recommended_action
    )


    try:

        inserted = threats_collection.insert_one(
            threat_document
        )

    except Exception as e:

        print(
            "MongoDB message save error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Message analysis completed but "
                "result could not be saved to database"
            )
        )


    return {

        "message": message,

        "risk": result["risk"],

        "score": result["score"],

        "confidence": result["confidence"],

        "is_threat": result["is_threat"],

        "reasons": result["reasons"],

        "recommended_action": recommended_action,

        "database_id": str(
            inserted.inserted_id
        )
    }