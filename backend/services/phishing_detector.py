import re
from urllib.parse import urlparse

from ml.ml_detector import predict_phishing


def detect_phishing(url: str):

    url = url.strip()
    url_lower = url.lower()

    score = 0
    reasons = []

    # ==========================================
    # ML PREDICTION
    # ==========================================

    ml_result = predict_phishing(url)

    ml_prediction = ml_result["prediction"]
    ml_probability = ml_result["phishing_probability"]

    # ==========================================
    # SUSPICIOUS KEYWORDS
    # ==========================================

    suspicious_words = [
        "login",
        "verify",
        "verification",
        "account",
        "password",
        "bank",
        "secure",
        "update",
        "urgent",
        "confirm",
        "signin",
        "free",
        "claim",
        "suspended"
    ]

    for word in suspicious_words:

        if word in url_lower:

            score += 8

            reasons.append(
                f"Suspicious keyword detected: {word}"
            )

    # ==========================================
    # IP ADDRESS
    # ==========================================

    ip_pattern = r"https?://(?:\d{1,3}\.){3}\d{1,3}"

    if re.search(ip_pattern, url):

        score += 25

        reasons.append(
            "URL uses an IP address instead of a normal domain"
        )

    # ==========================================
    # HTTPS CHECK
    # ==========================================

    if not url_lower.startswith("https://"):

        score += 15

        reasons.append(
            "URL does not use HTTPS"
        )

    # ==========================================
    # @ SYMBOL
    # ==========================================

    if "@" in url:

        score += 20

        reasons.append(
            "URL contains '@' which can hide the real destination"
        )

    # ==========================================
    # SUBDOMAIN CHECK
    # ==========================================

    try:

        parsed = urlparse(url)

        hostname = parsed.hostname

        if hostname:

            parts = hostname.split(".")

            if len(parts) > 4:

                score += 15

                reasons.append(
                    "URL contains an unusually large number of subdomains"
                )

    except Exception:

        score += 20

        reasons.append(
            "URL format appears invalid"
        )

    # ==========================================
    # LONG URL
    # ==========================================

    if len(url) > 100:

        score += 10

        reasons.append(
            "URL is unusually long"
        )

    # ==========================================
    # ADD ML RESULT
    # ==========================================

    if ml_prediction == 1:

        score += 30

        reasons.append(
            f"Machine-learning model classified this URL "
            f"as suspicious ({ml_probability}% phishing probability)"
        )

    else:

        reasons.append(
            f"Machine-learning model classified this URL "
            f"as likely legitimate ({ml_probability}% phishing probability)"
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
    # FINAL PHISHING DECISION
    # ==========================================

    is_phishing = (
        ml_prediction == 1
        or score >= 40
    )

    # ==========================================
    # CONFIDENCE
    # ==========================================

    if ml_prediction == 1:

        confidence = ml_probability

    else:

        confidence = 100 - ml_probability

    confidence = round(
        max(60, min(99, confidence))
    )

    # ==========================================
    # FINAL RESULT
    # ==========================================

    return {
        "url": url,
        "risk": risk,
        "score": score,
        "confidence": confidence,
        "is_phishing": is_phishing,
        "reasons": reasons,
        "ml_prediction": ml_prediction,
        "ml_probability": ml_probability
    }