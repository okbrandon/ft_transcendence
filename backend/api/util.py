import time
import base64
import random
import resend
import os

from plivo import RestClient

def generate_id(prefix: str) -> str:
    timestamp = str(int(time.time() * 1000))
    random_number = str(random.randint(0, 9999))
    encoded_timestamp = base64.urlsafe_b64encode((timestamp + random_number).encode()).decode().rstrip("=")
    return f"{prefix}_{encoded_timestamp}"

def send_welcome_email(to: list):
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

def send_verification_email(to: list, verification_link: str):
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

def send_otp_via_sms(to: str):
    auth_id = os.getenv("PLIVO_AUTHID")
    auth_token = os.getenv("PLIVO_AUTHTOKEN")
    client = RestClient(auth_id, auth_token)

    otp = f"{random.randint(100000, 999999):06d}"
    formatted_otp = f"{otp[:3]} {otp[3:]}"

    response = client.messages.create(
        src='Pong',
        dst=to,
        text=f"Your verification code is: {formatted_otp}. Please use this code to verify your account."
    )

    return response, otp