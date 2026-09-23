import pandas as pd
import re
import os
import joblib

from urllib.parse import urlparse
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# ==========================================
# CYBERGUARD - ML PHISHING URL TRAINER
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "phishing_dataset.csv"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "phishing_model.pkl"
)


# ==========================================
# URL FEATURE EXTRACTION
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
    features.append(sum(c.isdigit() for c in url))

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

    # 13. Number of subdomains
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
# LOAD DATASET
# ==========================================

print("\n==========================================")
print(" CYBERGUARD ML PHISHING DETECTOR")
print("==========================================\n")

print("Loading dataset...")

df = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully.")
print("Total samples:", len(df))


# ==========================================
# CHECK DATASET
# ==========================================

if "url" not in df.columns:
    raise Exception(
        "Dataset must contain a column named 'url'"
    )

if "label" not in df.columns:
    raise Exception(
        "Dataset must contain a column named 'label'"
    )


df = df.dropna(
    subset=["url", "label"]
)

print("\nClass distribution:")
print(df["label"].value_counts())


# ==========================================
# CREATE FEATURES
# ==========================================

print("\nExtracting URL features...")

X = df["url"].apply(
    extract_features
).tolist()

y = df["label"].astype(int)


# ==========================================
# TRAIN / TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ==========================================
# RANDOM FOREST MODEL
# ==========================================

print("\nTraining Random Forest model...")

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)

model.fit(
    X_train,
    y_train
)


# ==========================================
# MODEL EVALUATION
# ==========================================

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

print("\n==========================================")
print(" MODEL RESULTS")
print("==========================================")

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)

print("\nClassification Report:\n")

print(
    classification_report(
        y_test,
        predictions,
        zero_division=0
    )
)


# ==========================================
# SAVE MODEL
# ==========================================

joblib.dump(
    model,
    MODEL_PATH
)

print("\n==========================================")
print(" MODEL SAVED SUCCESSFULLY")
print("==========================================")

print(
    "Model location:"
)

print(
    MODEL_PATH
)

print("\nCYBERGUARD ML training completed.")