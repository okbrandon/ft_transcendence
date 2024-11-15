import re
import base64
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def validate_username(username):
    if username is None:
        return False
    return 4 <= len(username) <= 16 and re.match(r'^[a-zA-Z0-9_]+$', username) is not None and re.search(r'42$', username) is None

def validate_displayname(displayname):
    if displayname is None:
        return True
    return 4 <= len(displayname) <= 16 and re.match(r'^[a-zA-Z0-9_]+$', displayname) is not None

def validate_email(email):
    return len(email) <= 64 and re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None

def validate_lang(lang):
    return lang in ['EN', 'FR', 'ES']

def validate_image(image):
    if image is None:
        return True

    if not image.startswith('data:image/'):
        return False

    try:
        decoded_image = base64.b64decode(image.split(',')[1])

        if len(decoded_image) * 3 / 4 > 1_048_576:
            return False
        return True
    except Exception as _:
        return False

def validate_phone_number(phone):
    return re.match(r'^\+[1-9]\d{1,14}$', phone) or None

def validate_bio(bio):
    if bio is None:
        return True
    return len(bio) <= 280

def validate_password(password):
    if password is None:
        return False

    # Check length
    if len(password) < 8 or len(password.encode('utf-8')) > 72:
        return False

    # Check for at least one lowercase letter, one uppercase letter, one digit, and one special character
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False

    return True
