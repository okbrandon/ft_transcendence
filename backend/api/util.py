import time
import base64

def generate_id(prefix: str) -> str:
    timestamp = str(int(time.time() * 1000))
    encoded_timestamp = base64.urlsafe_b64encode(timestamp.encode()).decode().rstrip("=")
    return f"{prefix}_{encoded_timestamp}"