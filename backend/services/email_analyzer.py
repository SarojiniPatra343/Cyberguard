import re


def analyze_email(email_text: str):

    text = email_text.strip()

    if not text:
        return {
            "risk": "SAFE",
            "score": 0,
            "confidence": 90,
            "is_phishing": False,
            "reasons": []
        }

    text_lower = text.lower()

    score = 0
    reasons = []

    # ==========================================
    # 1. URGENCY DETECTION
    # ==========================================

    urgent_words = [
        "urgent",
        "immediately",
        "immediate action",
        "act now",
        "last warning",
        "final warning",
        "within 24 hours",
        "account will be closed",
        "account will be suspended"
    ]

    for word in urgent_words:
        if word in text_lower:
            score += 10
            reasons.append(
                f"Urgency indicator detected: {word}"
            )

    # ==========================================
    # 2. CREDENTIAL REQUEST DETECTION
    # ==========================================

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

    # ==========================================
    # 3. ACCOUNT VERIFICATION
    # ==========================================

    verification_words = [
        "verify your account",
        "verify account",
        "confirm your account",
        "confirm your identity",
        "verify your identity",
        "update your account",
        "validate your account"
    ]

    for word in verification_words:
        if word in text_lower:
            score += 15
            reasons.append(
                f"Suspicious verification request detected: {word}"
            )

    # ==========================================
    # 4. FINANCIAL / BANKING TERMS
    # ==========================================

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
        "billing"
    ]

    for word in financial_words:
        if word in text_lower:
            score += 8
            reasons.append(
                f"Financial-related term detected: {word}"
            )

    # ==========================================
    # 5. SUSPICIOUS ACTIONS
    # ==========================================

    suspicious_actions = [
        "click here",
        "click the link",
        "click below",
        "open the link",
        "download the attachment",
        "download this file",
        "visit this link"
    ]

    for word in suspicious_actions:
        if word in text_lower:
            score += 12
            reasons.append(
                f"Suspicious action request detected: {word}"
            )

    # ==========================================
    # 6. REWARD / FREE OFFER
    # ==========================================

    reward_words = [
        "you won",
        "winner",
        "congratulations",
        "free gift",
        "claim your prize",
        "special reward",
        "free money",
        "lottery"
    ]

    for word in reward_words:
        if word in text_lower:
            score += 12
            reasons.append(
                f"Possible scam/reward indicator detected: {word}"
            )

    # ==========================================
    # 7. THREATENING LANGUAGE
    # ==========================================

    threat_words = [
        "account suspended",
        "account blocked",
        "account terminated",
        "legal action",
        "police",
        "penalty",
        "fine",
        "security breach"
    ]

    for word in threat_words:
        if word in text_lower:
            score += 12
            reasons.append(
                f"Threatening language detected: {word}"
            )

    # ==========================================
    # 8. URL DETECTION
    # ==========================================

    urls = re.findall(
        r"https?://[^\s]+",
        text_lower
    )

    if urls:
        score += 10
        reasons.append(
            f"Email contains {len(urls)} web link(s)"
        )

    # ==========================================
    # 9. EMAIL LENGTH / EXCESSIVE CAPITALIZATION
    # ==========================================

    words = text.split()

    if len(words) > 150:
        score += 5
        reasons.append(
            "Email contains an unusually large amount of text"
        )

    uppercase_letters = sum(
        1 for char in text if char.isupper()
    )

    alphabetic_letters = sum(
        1 for char in text if char.isalpha()
    )

    if alphabetic_letters > 20:

        uppercase_ratio = (
            uppercase_letters / alphabetic_letters
        )

        if uppercase_ratio > 0.35:
            score += 8
            reasons.append(
                "Excessive use of uppercase characters detected"
            )

    # ==========================================
    # LIMIT SCORE
    # ==========================================

    score = min(score, 100)

    # ==========================================
    # RISK CLASSIFICATION
    # ==========================================

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

    # ==========================================
    # CONFIDENCE
    # ==========================================

    if score == 0:
        confidence = 90

    else:
        confidence = min(
            98,
            60 + score
        )

    # ==========================================
    # THREAT DECISION
    # ==========================================

    is_phishing = score >= 40

    return {
        "risk": risk,
        "score": score,
        "confidence": confidence,
        "is_phishing": is_phishing,
        "reasons": reasons
    }