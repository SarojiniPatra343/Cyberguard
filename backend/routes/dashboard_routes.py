from fastapi import APIRouter, HTTPException

from config.database import threats_collection


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def get_dashboard_stats():

    try:

        # =========================================================
        # TOTAL ANALYSES
        # =========================================================

        total = threats_collection.count_documents({})


        # =========================================================
        # THREATS DETECTED
        # =========================================================

        detected = threats_collection.count_documents({
            "is_threat": True
        })


        # =========================================================
        # SAFE RESULTS
        # =========================================================

        safe = threats_collection.count_documents({
            "is_threat": False
        })


        # =========================================================
        # RISK LEVELS
        # =========================================================

        critical = threats_collection.count_documents({
            "risk": "CRITICAL"
        })

        high = threats_collection.count_documents({
            "risk": "HIGH"
        })

        medium = threats_collection.count_documents({
            "risk": "MEDIUM"
        })

        low = threats_collection.count_documents({
            "risk": "LOW"
        })


        # =========================================================
        # ANALYSIS TYPES
        # =========================================================

        url_count = threats_collection.count_documents({
            "type": "URL"
        })

        email_count = threats_collection.count_documents({
            "type": "EMAIL"
        })

        message_count = threats_collection.count_documents({
            "type": "MESSAGE"
        })


        # =========================================================
        # SECURITY SCORE
        # =========================================================
        #
        # Score is based on the percentage of safe analyses.
        #
        # Example:
        # 10 total
        # 8 safe
        # 2 threats
        #
        # Security Score = 80%
        #
        # If there are no analyses, score = 100.
        # =========================================================

        if total == 0:

            security_score = 100

        else:

            security_score = round(
                (safe / total) * 100
            )


        # =========================================================
        # RECENT ACTIVITY
        # =========================================================

        recent_documents = list(
            threats_collection
            .find({})
            .sort("created_at", -1)
            .limit(10)
        )


        recent_activity = []


        for document in recent_documents:

            created_at = document.get(
                "created_at"
            )

            if created_at:

                try:
                    created_at = created_at.isoformat()

                except Exception:

                    created_at = str(created_at)

            else:

                created_at = None


            recent_activity.append({

                "id": str(
                    document.get("_id")
                ),

                "type": document.get(
                    "type",
                    "UNKNOWN"
                ),

                "threat_type": document.get(
                    "threat_type",
                    "Unknown"
                ),

                "risk": document.get(
                    "risk",
                    "SAFE"
                ),

                "risk_score": document.get(
                    "risk_score",
                    0
                ),

                "confidence": document.get(
                    "confidence",
                    0
                ),

                "is_threat": document.get(
                    "is_threat",
                    False
                ),

                "created_at": created_at

            })


        # =========================================================
        # RESPONSE
        # =========================================================

        return {

            "success": True,

            "stats": {

                "total": total,

                "detected": detected,

                "safe": safe,

                "critical": critical,

                "high": high,

                "medium": medium,

                "low": low,

                "url": url_count,

                "email": email_count,

                "message": message_count,

                "security_score": security_score

            },

            "recent_activity": recent_activity

        }


    except Exception as e:

        print(
            "DASHBOARD MONGODB ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load dashboard "
                "statistics from MongoDB"
            )
        )