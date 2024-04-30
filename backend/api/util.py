import time
import base64
import os
import jwt

from .models import User

def generate_id(prefix: str) -> str:
    timestamp = str(int(time.time() * 1000))
    encoded_timestamp = base64.urlsafe_b64encode(timestamp.encode()).decode().rstrip("=")
    return f"{prefix}_{encoded_timestamp}"

def generate_jwt(user_id: str) -> str:
    payload = {
        "userID": user_id,
        "exp": int(time.time()) + 3600*24*7, # 1 week
        "iss": int(time.time() * 1000)
    }
    return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")

def decode_jwt(token: str) -> dict:
    return jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])

def get_user_from_jwt(token: str) -> User:
    if is_jwt_expired(token):
        return None
    payload = decode_jwt(token)
    return User.objects.get(userID=payload["userID"])

def is_jwt_expired(token: str) -> bool:
    return decode_jwt(token)["exp"] < int(time.time())