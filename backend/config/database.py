
import os

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI is not configured in .env")

client = MongoClient(MONGO_URI)

db = client["cyberguard"]

# Existing collection
threats_collection = db["threats"]

# Authentication collection
users_collection = db["users"]


def test_database_connection():
    try:
        client.admin.command("ping")
        print("MongoDB connected successfully")
        return True

    except Exception as e:
        print("MongoDB connection failed:", e)
        return False
