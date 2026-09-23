from datetime import datetime, timezone


def create_threat_document(
    input_value,
    input_type,
    threat_type,
    risk,
    risk_score,
    confidence,
    is_threat,
    evidence,
    recommended_action
):
    return {
        "input": input_value,
        "type": input_type,
        "threat_type": threat_type,
        "risk": risk,
        "risk_score": risk_score,
        "confidence": confidence,
        "is_threat": is_threat,
        "evidence": evidence,
        "recommended_action": recommended_action,
        "created_at": datetime.now(timezone.utc)
    }