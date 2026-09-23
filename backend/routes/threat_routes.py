from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.phishing_detector import detect_phishing
from config.database import threats_collection
from models.threat_model import create_threat_document


router = APIRouter(
    prefix="/api/threats",
    tags=["Threat Analysis"]
)


class ThreatRequest(BaseModel):
    input: str
    type: str = "URL"


# =========================================================
# ANALYZE THREAT
# =========================================================

@router.post("/analyze")
def analyze_threat(request: ThreatRequest):

    if not request.input.strip():
        raise HTTPException(
            status_code=400,
            detail="Please provide a URL or text to analyze"
        )

    # =====================================================
    # URL ANALYSIS
    # =====================================================

    if request.type.upper() == "URL":

        result = detect_phishing(request.input)

        response = {
            "input": request.input,
            "type": "URL",
            "threat_type": "Phishing",
            "risk": result["risk"],
            "risk_score": result["score"],
            "confidence": result["confidence"],
            "is_threat": result["is_phishing"],
            "evidence": result["reasons"],
            "recommended_action": (
                "Block this URL and avoid entering personal information."
                if result["is_phishing"]
                else
                "URL appears safe, but continue to use normal security precautions."
            )
        }

    # =====================================================
    # TEXT ANALYSIS
    # =====================================================

    else:

        text = request.input.lower()

        suspicious_words = [
            "password",
            "verify your account",
            "urgent",
            "click here",
            "bank",
            "otp",
            "login",
            "account suspended",
            "confirm your identity"
        ]

        detected = [
            word
            for word in suspicious_words
            if word in text
        ]

        if detected:

            score = min(
                95,
                30 + len(detected) * 12
            )

            if score >= 70:
                risk = "HIGH"
            elif score >= 40:
                risk = "MEDIUM"
            else:
                risk = "LOW"

            response = {
                "input": request.input,
                "type": "TEXT",
                "threat_type": "Social Engineering / Phishing",
                "risk": risk,
                "risk_score": score,
                "confidence": score,
                "is_threat": score >= 40,
                "evidence": [
                    f"Suspicious phrase detected: {word}"
                    for word in detected
                ],
                "recommended_action":
                    "Do not click suspicious links or provide credentials."
            }

        else:

            response = {
                "input": request.input,
                "type": "TEXT",
                "threat_type": "Unknown",
                "risk": "SAFE",
                "risk_score": 0,
                "confidence": 90,
                "is_threat": False,
                "evidence": [
                    "No major suspicious indicators detected."
                ],
                "recommended_action":
                    "No immediate action required."
            }

    # =====================================================
    # CREATE MONGODB DOCUMENT
    # =====================================================

    threat_document = create_threat_document(
        input_value=response["input"],
        input_type=response["type"],
        threat_type=response["threat_type"],
        risk=response["risk"],
        risk_score=response["risk_score"],
        confidence=response["confidence"],
        is_threat=response["is_threat"],
        evidence=response["evidence"],
        recommended_action=response["recommended_action"]
    )

    # =====================================================
    # SAVE RESULT TO MONGODB
    # =====================================================

    try:

        inserted = threats_collection.insert_one(
            threat_document
        )

        response["database_id"] = str(
            inserted.inserted_id
        )

    except Exception as e:

        print("MongoDB save error:", e)

        raise HTTPException(
            status_code=500,
            detail="Threat analysis completed but result could not be saved to database"
        )

    return response


# =========================================================
# GET THREAT HISTORY
# =========================================================

@router.get("/history")
def get_threat_history():

    try:
        # Test MongoDB connection first
        from config.database import client

        client.admin.command("ping")

        # Get latest 50 records
        threats = list(
            threats_collection
            .find({})
            .sort("created_at", -1)
            .limit(50)
        )

        history = []

        for threat in threats:

            history.append({
                "_id": str(threat.get("_id", "")),
                "input": str(threat.get("input", "")),
                "type": str(threat.get("type", "UNKNOWN")),
                "threat_type": str(
                    threat.get("threat_type", "Unknown")
                ),
                "risk": str(
                    threat.get("risk", "SAFE")
                ),
                "risk_score": threat.get(
                    "risk_score", 0
                ),
                "confidence": threat.get(
                    "confidence", 0
                ),
                "is_threat": bool(
                    threat.get("is_threat", False)
                ),
                "evidence": threat.get(
                    "evidence", []
                ),
                "recommended_action": threat.get(
                    "recommended_action", ""
                ),
                "created_at": (
                    threat["created_at"].isoformat()
                    if threat.get("created_at")
                    else None
                )
            })

        return {
            "success": True,
            "count": len(history),
            "threats": history
        }

    except Exception as e:

        print("\n==============================")
        print("MONGODB HISTORY ERROR")
        print("==============================")
        print(type(e).__name__)
        print(str(e))
        print("==============================\n")

        raise HTTPException(
            status_code=500,
            detail=f"History error: {str(e)}"
        )

    try:

        threats = list(
            threats_collection
            .find({})
            .sort("created_at", -1)
            .limit(50)
        )

        for threat in threats:

            threat["_id"] = str(
                threat["_id"]
            )

            if "created_at" in threat:
                threat["created_at"] = (
                    threat["created_at"].isoformat()
                )

        return {
            "success": True,
            "count": len(threats),
            "threats": threats
        }

    except Exception as e:

        print("MongoDB history error:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve threat history"
        )