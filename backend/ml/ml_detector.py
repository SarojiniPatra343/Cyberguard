import os
import re
import joblib

from urllib.parse import urlparse


# ==========================================
# CYBERGUARD ML PHISHING PREDICTOR
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "phishing_model.pkl"
)


# ==========================================
# LOAD TRAINED MODEL
# ==========================================

model = joblib.load(MODEL_PATH)


# ==========================================
# FEATURE EXTRACTION
# ==========================================

def extract_features(url):

    url = str(url).strip()
    url_lower = url.lower()

    features = []

    # 1. URL length
    features.append(len(url))

    # 2. Number of dots
    features.append(url.count("."))

    # 3. Number of hyphens
    features.append(url.count("-"))

    # 4. Number of underscores
    features.append(url.count("_"))

    # 5. Number of slashes
    features.append(url.count("/"))

    # 6. Number of question marks
    features.append(url.count("?"))

    # 7. Number of equal signs
    features.append(url.count("="))

    # 8. Number of @ symbols
    features.append(url.count("@"))

    # 9. Number of digits
    features.append(
        sum(c.isdigit() for c in url)
    )

    # 10. HTTPS
    features.append(
        1 if url_lower.startswith("https://") else 0
    )

    # 11. Suspicious keywords
    suspicious_words = [
        "login",
        "signin",
        "verify",
        "verification",
        "account",
        "password",
        "secure",
        "update",
        "confirm",
        "bank",
        "urgent",
        "free",
        "claim",
        "suspended"
    ]

    keyword_count = sum(
        1
        for word in suspicious_words
        if word in url_lower
    )

    features.append(keyword_count)

    # 12. IP address
    ip_pattern = r"https?://(?:\d{1,3}\.){3}\d{1,3}"

    features.append(
        1 if re.search(ip_pattern, url) else 0
    )

    # 13. Subdomain count
    try:

        parsed = urlparse(url)

        hostname = parsed.hostname

        if hostname:

            subdomain_count = max(
                0,
                len(hostname.split(".")) - 2
            )

        else:

            subdomain_count = 0

    except Exception:

        subdomain_count = 0

    features.append(subdomain_count)

    return features


# ==========================================
# ML PREDICTION
# ==========================================

def predict_phishing(url):

    features = extract_features(url)

    prediction = model.predict(
        [features]
    )[0]

    probability = model.predict_proba(
        [features]
    )[0][1]

    return {
        "prediction": int(prediction),
        "phishing_probability": round(
            float(probability) * 100,
            2
        )
    }