import time
import base64
import random

def generate_id(prefix: str) -> str:
    timestamp = str(int(time.time() * 1000))
    random_number = str(random.randint(0, 9999))
    encoded_timestamp = base64.urlsafe_b64encode((timestamp + random_number).encode()).decode().rstrip("=")
    return f"{prefix}_{encoded_timestamp}"