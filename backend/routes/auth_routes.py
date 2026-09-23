import os
import re

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext

from config.database import users_collection


# ==========================================
# ROUTER
# ==========================================

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# ==========================================
# PASSWORD CONFIGURATION
# ==========================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# ==========================================
# REQUEST MODELS
# ==========================================

class RegisterRequest(BaseModel):
    name: str
    email: str
    mobile: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ForgotPasswordRequest(BaseModel):
    mobile: str


class ResetPasswordRequest(BaseModel):
    mobile: str
    otp: str
    new_password: str


# ==========================================
# VALIDATION FUNCTIONS
# ==========================================

def validate_email(email: str):
    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    return re.match(pattern, email) is not None


def validate_mobile(mobile: str):
    pattern = r"^\+[1-9]\d{7,14}$"
    return re.match(pattern, mobile) is not None


def validate_password(password: str):

    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters"
        )

    # bcrypt supports a maximum of 72 bytes
    if len(password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password must not exceed 72 bytes"
        )


# ==========================================
# REGISTER
# ==========================================

@router.post("/register")
def register(data: RegisterRequest):

    name = data.name.strip()
    email = data.email.strip().lower()
    mobile = data.mobile.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required"
        )

    if not validate_email(email):
        raise HTTPException(
            status_code=400,
            detail="Invalid email address"
        )

    if not validate_mobile(mobile):
        raise HTTPException(
            status_code=400,
            detail="Mobile number must include country code. Example: +919876543210"
        )

    validate_password(data.password)

    existing_email = users_collection.find_one({
        "email": email
    })

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    existing_mobile = users_collection.find_one({
        "mobile": mobile
    })

    if existing_mobile:
        raise HTTPException(
            status_code=400,
            detail="Mobile number already registered"
        )

    hashed_password = pwd_context.hash(data.password)

    user = {
        "name": name,
        "email": email,
        "mobile": mobile,
        "password": hashed_password
    }

    users_collection.insert_one(user)

    return {
        "success": True,
        "message": "Registration successful"
    }


# ==========================================
# LOGIN
# ==========================================

@router.post("/login")
def login(data: LoginRequest):

    email = data.email.strip().lower()

    if not validate_email(email):
        raise HTTPException(
            status_code=400,
            detail="Invalid email address"
        )

    if not data.password:
        raise HTTPException(
            status_code=400,
            detail="Password is required"
        )

    user = users_collection.find_one({
        "email": email
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    try:

        password_valid = pwd_context.verify(
            data.password,
            user["password"]
        )

    except Exception as e:

        print("Password verification error:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to verify password"
        )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "mobile": user.get("mobile", "")
        }
    }


# ==========================================
# FORGOT PASSWORD
# ==========================================

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest):

    mobile = data.mobile.strip()

    if not validate_mobile(mobile):
        raise HTTPException(
            status_code=400,
            detail="Mobile number must include country code. Example: +919876543210"
        )

    user = users_collection.find_one({
        "mobile": mobile
    })

    if not user:
        raise HTTPException(
            status_code=404,
            detail="No account found with this mobile number"
        )

    # Temporary response until MSG91 OTP is connected
    return {
        "success": True,
        "message": "Mobile number verified. OTP service is ready to be connected."
    }


# ==========================================
# RESET PASSWORD
# ==========================================

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):

    mobile = data.mobile.strip()
    otp = data.otp.strip()

    if not validate_mobile(mobile):
        raise HTTPException(
            status_code=400,
            detail="Invalid mobile number"
        )

    if not otp.isdigit() or len(otp) != 6:
        raise HTTPException(
            status_code=400,
            detail="OTP must contain 6 digits"
        )

    validate_password(data.new_password)

    user = users_collection.find_one({
        "mobile": mobile
    })

    if not user:
        raise HTTPException(
            status_code=404,
            detail="No account found with this mobile number"
        )

    # ==========================================
    # TEMPORARY OTP CHECK
    # ==========================================
    # Replace this with MSG91 OTP verification
    # when the MSG91 integration is connected.

    hashed_password = pwd_context.hash(
        data.new_password
    )

    users_collection.update_one(
        {
            "mobile": mobile
        },
        {
            "$set": {
                "password": hashed_password
            }
        }
    )

    return {
        "success": True,
        "message": "Password reset successful"
    }