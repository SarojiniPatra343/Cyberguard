import re


def analyze_message(message: str):

    text = message.strip()

    if not text:
        return {
            "risk": "SAFE",
            "score": 0,
            "confidence": 90,
            "is_threat": False,
            "reasons": []
        }

    text_lower = text.lower()

    score = 0
    reasons = []


    # ==============================
    # URGENCY INDICATORS
    # ==============================

    urgent_words = [
        "urgent",
        "immediately",
        "act now",
        "right now",
        "last warning",
        "final warning",
        "within 24 hours",
        "respond immediately",
        "do it now"
    ]

    for word in urgent_words:

        if word in text_lower:

            score += 10

            reasons.append(
                f"Urgency indicator detected: {word}"
            )


    # ==============================
    # CREDENTIAL REQUESTS
    # ==============================

    credential_words = [
        "password",
        "username",
        "login",
        "sign in",
        "signin",
        "credentials",
        "otp",
        "one time password",
        "security code",
        "pin"
    ]

    for word in credential_words:

        if word in text_lower:

            score += 10

            reasons.append(
                f"Credential-related term detected: {word}"
            )


    # ==============================
    # VERIFICATION REQUESTS
    # ==============================

    verification_words = [
        "verify your account",
        "verify account",
        "confirm your account",
        "confirm your identity",
        "verify your identity",
        "update your account",
        "validate your account",
        "verify now"
    ]

    for word in verification_words:

        if word in text_lower:

            score += 15

            reasons.append(
                f"Suspicious verification request detected: {word}"
            )


    # ==============================
    # FINANCIAL INDICATORS
    # ==============================

    financial_words = [
        "bank",
        "bank account",
        "credit card",
        "debit card",
        "payment",
        "transaction",
        "refund",
        "money",
        "invoice",
        "billing",
        "upi"
    ]

    for word in financial_words:

        if word in text_lower:

            score += 8

            reasons.append(
                f"Financial-related term detected: {word}"
            )


    # ==============================
    # SUSPICIOUS ACTIONS
    # ==============================

    action_words = [
        "click here",
        "click the link",
        "click below",
        "open the link",
        "visit this link",
        "download this file",
        "send otp",
        "share otp",
        "send password"
    ]

    for word in action_words:

        if word in text_lower:

            score += 12

            reasons.append(
                f"Suspicious action request detected: {word}"
            )


    # ==============================
    # REWARD / SCAM INDICATORS
    # ==============================

    reward_words = [
        "you won",
        "winner",
        "congratulations",
        "free gift",
        "claim your prize",
        "special reward",
        "free money",
        "lottery",
        "cash prize",
        "reward"
    ]

    for word in reward_words:

        if word in text_lower:

            score += 12

            reasons.append(
                f"Possible scam/reward indicator detected: {word}"
            )


    # ==============================
    # THREATENING LANGUAGE
    # ==============================

    threat_words = [
        "account suspended",
        "account blocked",
        "account terminated",
        "legal action",
        "police",
        "penalty",
        "fine",
        "security breach",
        "account will be closed"
    ]

    for word in threat_words:

        if word in text_lower:

            score += 12

            reasons.append(
                f"Threatening language detected: {word}"
            )


    # ==============================
    # URL DETECTION
    # ==============================

    urls = re.findall(
        r"https?://[^\s]+",
        text_lower
    )

    if urls:

        score += 15

        reasons.append(
            f"Message contains {len(urls)} web link(s)"
        )


    # ==============================
    # PHONE NUMBER DETECTION
    # ==============================

    phone_numbers = re.findall(
        r"\b\d{10}\b",
        text
    )

    if phone_numbers:

        score += 5

        reasons.append(
            "Message contains a phone number"
        )


    # ==============================
    # EXCESSIVE CAPITALIZATION
    # ==============================

    uppercase_letters = sum(
        1 for char in text
        if char.isupper()
    )

    alphabetic_letters = sum(
        1 for char in text
        if char.isalpha()
    )

    if alphabetic_letters > 20:

        uppercase_ratio = (
            uppercase_letters /
            alphabetic_letters
        )

        if uppercase_ratio > 0.35:

            score += 8

            reasons.append(
                "Excessive use of uppercase characters detected"
            )


    # ==============================
    # LIMIT SCORE
    # ==============================

    score = min(score, 100)


    # ==============================
    # RISK LEVEL
    # ==============================

    if score >= 70:

        risk = "CRITICAL"

    elif score >= 50:

        risk = "HIGH"

    elif score >= 30:

        risk = "MEDIUM"

    elif score > 0:

        risk = "LOW"

    else:

        risk = "SAFE"


    # ==============================
    # CONFIDENCE
    # ==============================

    if score == 0:

        confidence = 90

    else:

        confidence = min(
            98,
            60 + score
        )


    # ==============================
    # THREAT DECISION
    # ==============================

    is_threat = score >= 40


    return {

        "risk": risk,

        "score": score,

        "confidence": confidence,

        "is_threat": is_threat,

        "reasons": reasons
    }