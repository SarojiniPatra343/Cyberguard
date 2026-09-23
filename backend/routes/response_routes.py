from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/response",
    tags=["Threat Response"]
)


class ResponseRequest(BaseModel):
    action: str
    threat: str = "Unknown"
    target: str = "Unknown"


@router.post("/execute")
def execute_response(request: ResponseRequest):

    if not request.action.strip():
        raise HTTPException(
            status_code=400,
            detail="Response action is required"
        )

    allowed_actions = [
        "Block Malicious URL",
        "Quarantine Threat",
        "Revoke User Session",
        "Block Suspicious Link",
        "Alert Security Administrator",
        "Start Security Check"
    ]

    if request.action not in allowed_actions:
        raise HTTPException(
            status_code=400,
            detail="Invalid response action"
        )

    return {
        "success": True,
        "action": request.action,
        "threat": request.threat,
        "target": request.target,
        "status": "EXECUTED",
        "message": f"{request.action} has been executed successfully."
    }