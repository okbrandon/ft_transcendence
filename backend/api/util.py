import time
import base64
import random
import resend
import os
import httpx
import logging

from plivo import RestClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_id(prefix: str) -> str:
    timestamp = str(int(time.time() * 1000))
    random_number = str(random.randint(0, 9999))
    encoded_timestamp = base64.urlsafe_b64encode((timestamp + random_number).encode()).decode().rstrip("=")
    return f"{prefix}_{encoded_timestamp}"

def send_welcome_email(to: str):
    resend.api_key = os.getenv("RESEND_API_KEY")

    params: resend.Emails.SendParams = {
        "from": "noreply@transcendence.evan.sh",
        "to": to,
        "subject": "Welcome to Pong!",
        "html": f"""
            <h1>Welcome to Pong!</h1>
            <p>Thank you for joining our community.</p>
            <h2>GDPR Compliance</h2>
            <p>We value your privacy. In accordance with GDPR regulations:</p>
            <ul>
                <li>You can request a copy of your personal data at any time.</li>
                <li>You can request anonymization of your content.</li>
            </ul>
            <p>Both of these options are available in your account settings.</p>
            <p>Welcome aboard!</p>
            <p>bsoubaig, e<b>v</b>morvan, hanmpark, kquetat-</p>
        """,
    }

    email = resend.Emails.send(params)

def send_verification_email(to: str, verification_link: str):
    resend.api_key = os.getenv("RESEND_API_KEY")

    params: resend.Emails.SendParams = {
        "from": "noreply@transcendence.evan.sh",
        "to": to,
        "subject": "Verify your email to access your account",
        "html": f"""
            <p>To complete your registration, please verify your email address by clicking the link below:</p>
            <p><a href='{verification_link}'>Verify your email</a></p>
        """,
    }

    email = resend.Emails.send(params)

def send_otp_via_sms(to: str, otp: str):
    auth_id = os.getenv("PLIVO_AUTHID")
    auth_token = os.getenv("PLIVO_AUTHTOKEN")
    client = RestClient(auth_id, auth_token)

    formatted_otp = f"{otp[:3]} {otp[3:]}"

    response = client.messages.create(
        src='Pong',
        dst=to,
        text=f"Your verification code is: {formatted_otp}. Please use this code to verify your account."
    )

    return response, otp

def send_otp_via_email(to: str, otp: str):
    resend.api_key = os.getenv("RESEND_API_KEY")

    formatted_otp = f"{otp[:3]} {otp[3:]}"

    params: resend.Emails.SendParams = {
        "from": "noreply@transcendence.evan.sh",
        "to": to,
        "subject": "Your One-Time Password (OTP)",
        "html": f"""
            <h1>Your One-Time Password (OTP)</h1>
            <p>Your verification code is: <strong>{formatted_otp}</strong></p>
            <p>Please use this code to verify your account.</p>
            <p>If you didn't request this code, please change your account password.</p>
        """,
    }

    email = resend.Emails.send(params)
    return email

def send_data_package_ready_email(to: str):
    resend.api_key = os.getenv("RESEND_API_KEY")

    params: resend.Emails.SendParams = {
        "from": "noreply@transcendence.evan.sh",
        "to": to,
        "subject": "Your Data Package is Ready",
        "html": f"""
            <h1>Your Data Package is Ready</h1>
            <p>We've prepared your data package as requested.</p>
            <p>To download your user package:</p>
            <ol>
                <li>Log in to your account</li>
                <li>Go to Settings</li>
                <li>Click on 'Data Privacy'</li>
                <li>You'll find the option to download your user package there</li>
            </ol>
            <p>Thank you for being a part of our community!</p>
        """,
    }

    email = resend.Emails.send(params)

def get_safe_profile(data: dict, me: bool, many: bool = False):
    if many:
        return [get_safe_profile(item, me, False) for item in data]

    safe_data = data.copy()
    fields_to_remove = ['password', 'mfaToken', 'oauthAccountID']

    if not me:
        fields_to_remove.extend(['email', 'phone_number', 'money'])

    for field in fields_to_remove:
        safe_data.pop(field, None)

    return safe_data

async def get_user_id_from_token(token):
    try:
        url = "https://localhost:8443/api/v1/users/@me/profile"
        headers = {
            "Authorization": f"Bearer {token}"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)

        if response.status_code != 200:
            raise Exception(f"Exited with bad status_code: {response.status_code} {response.reason}")

        user_data = response.json()
        return user_data["userID"]

    except Exception as err:
        logger.error(f"User from token failed: {err}")
        return None
