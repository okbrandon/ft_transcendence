import re
import base64
import pyotp
import os

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import login
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.contrib.auth.hashers import check_password

from ..models import User, VerificationCode
from ..util import generate_id, send_verification_email, send_otp_via_email, send_otp_via_sms
from ..backends import AuthBackend
from ..validators import validate_username, validate_email, validate_password, validate_lang


@permission_classes([AllowAny])
class AuthRegister(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = self.validate_request_data(request.data)
        except ValidationError as ex:
            return Response({"error": "Internal server error"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=data['username']).exists():
            return Response({"error": "Username is already taken"}, status=status.HTTP_409_CONFLICT)

        if User.objects.filter(email=data['email']).exists():
            return Response({"error": "Email is already in use"}, status=status.HTTP_409_CONFLICT)

        if re.search(r'42$', data['username']):
            return Response({"error": "Username cannot end with '42'"}, status=status.HTTP_400_BAD_REQUEST)

        skip_email_verification = os.environ.get('SKIP_EMAIL_VERIFICATION', '').lower() == 'true'

        user = User.objects.create(
            userID=generate_id('user'),
            username=data['username'],
            email=data['email'],
            password=make_password(data['password']),
            lang=data['lang'],
            money=100000 if skip_email_verification else 0,
            flags=1 if skip_email_verification else 0  # Set EMAIL_VERIFIED flag if skipping verification
        )

        if not skip_email_verification:
            verification_code = generate_id('code')
            VerificationCode.objects.create(
                userID=user.userID,
                code=verification_code,
                expires_at=timezone.now() + timezone.timedelta(hours=1)  # Code expires in 1 hour
            )
            verification_link = f"{os.environ.get('BASE_URL')}/verify?code={base64.urlsafe_b64encode(f'{user.userID}.{verification_code}'.encode()).decode()}"
            send_verification_email(data['email'], verification_link)

        return Response(status=status.HTTP_201_CREATED)

    def validate_request_data(self, data):
        required_fields = {'username', 'email', 'password', 'lang'}
        if not all(field in data for field in required_fields):
            raise ValidationError("All fields ['username', 'email', 'password', 'lang'] are required.")

        username, email, password, lang = data['username'], data['email'], data['password'], data['lang']

        if not validate_username(username):
            raise ValidationError("Invalid username. It must be 4-16 characters long and alphanumeric and cannot end with '42'.")
        if not validate_email(email):
            raise ValidationError("Invalid email address.")
        if not validate_password(password):
            raise ValidationError("Invalid password. It must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one digit, and one special character.")
        if not validate_lang(lang):
            raise ValidationError("Unsupported language. Supported languages are 'EN', 'FR' or 'ES'.")

        return {
            "username": username,
            "email": email,
            "password": password,
            "lang": lang
        }

@permission_classes([AllowAny])
class AuthLogin(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        otp = request.data.get('otp', None)

        try:
            user = User.objects.get(username=username)
            if not check_password(password, user.password):
                return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
            if user.oauthAccountID is not None:
                return Response({"error": "This is an OAuth account. Please login with your identity provider."}, status=status.HTTP_400_BAD_REQUEST)
            if user.mfaToken and not otp:
                available_platforms = ["app", "email"]
                if user.phone_number:
                    available_platforms.append("sms")
                return Response({
                    "error": "OTP is required for this account.",
                    "available_platforms": available_platforms
                }, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            pass

        user = AuthBackend.AuthBackend().authenticate(request, username=username, password=password, otp=otp)

        if user is None:
            return Response({"error": "Invalid credentials or OTP."}, status=status.HTTP_401_UNAUTHORIZED)

        if user.flags & (1 << 2):
            return Response({"error": "This account has been disabled."}, status=status.HTTP_403_FORBIDDEN)

        if not user.flags & (1 << 0):
            # Check if verification code has expired
            verification = VerificationCode.objects.filter(userID=user.userID).first()
            if verification and verification.expires_at < timezone.now():
                # Generate new verification code
                new_verification_code = generate_id('code')
                verification.code = new_verification_code
                verification.expires_at = timezone.now() + timezone.timedelta(hours=1)
                verification.save()

                # Send new verification email
                verification_link = f"{os.environ.get('BASE_URL')}/verify?code={base64.urlsafe_b64encode(f'{user.userID}.{new_verification_code}'.encode()).decode()}"
                send_verification_email(user.email, verification_link)

                return Response({"error": "Email not verified. A new verification email has been sent."}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({"error": "Email not verified. Please verify your email before logging in."}, status=status.HTTP_403_FORBIDDEN)

        login(request, user)

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        return Response({
            "refresh": str(refresh),
            "access": access
        }, status=status.HTTP_200_OK)

class EnableTOTP(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user

        if user.mfaToken:
            return Response({"error": "MFA is already enabled."}, status=status.HTTP_400_BAD_REQUEST)

        user.mfaToken = pyotp.random_base32()
        user.save()

        return Response({"message": "MFA enabled successfully.", "token": user.mfaToken}, status=status.HTTP_200_OK)

class DeleteTOTP(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        otp = request.data.get('otp')

        if not user.mfaToken:
            return Response({"error": "MFA is not enabled for this account."}, status=status.HTTP_400_BAD_REQUEST)

        if not otp:
            return Response({"error": "OTP is required."}, status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.TOTP(user.mfaToken)
        if totp.verify(otp, valid_window=6):
            user.mfaToken = None
            user.save()
            return Response({"message": "MFA has been disabled."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

class PlatformAvailability(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        available_platforms = ["app", "email"]

        if not user.mfaToken:
            return Response({"error": "MFA is not enabled for this account."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if Plivo environment variables are set
        auth_id = os.getenv("PLIVO_AUTHID")
        auth_token = os.getenv("PLIVO_AUTHTOKEN")

        if user.phone_number and auth_id and auth_token:
            available_platforms.append("sms")

        return Response({
            "available_platforms": available_platforms
        }, status=status.HTTP_200_OK)

class RequestTOTP(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        platform = request.data.get('platform')

        if request.user.is_authenticated:
            user = request.user
        elif username and password:
            user = User.objects.get(username=username)
            if not check_password(password, user.password):
                return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.mfaToken:
            return Response({"error": "MFA is not enabled for this account."}, status=status.HTTP_400_BAD_REQUEST)

        if not platform:
            return Response({"error": "Platform is required."}, status=status.HTTP_400_BAD_REQUEST)

        if platform not in ['email', 'sms']:
            return Response({"error": "Invalid platform. Choose 'email' or 'sms'."}, status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.TOTP(user.mfaToken)
        otp = totp.now()

        if platform == 'email':
            send_otp_via_email(user.email, otp)
        elif platform == 'sms':
            auth_id = os.getenv("PLIVO_AUTHID")
            auth_token = os.getenv("PLIVO_AUTHTOKEN")
            if not user.phone_number:
                return Response({"error": "Phone number not set for this account."}, status=status.HTTP_400_BAD_REQUEST)
            if not auth_id or not auth_token:
                return Response({"error": "SMS platform is not configured."}, status=status.HTTP_400_BAD_REQUEST)
            send_otp_via_sms(user.phone_number, otp)

        return Response({"message": f"OTP sent via {platform}."}, status=status.HTTP_200_OK)

class CheckOTP(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        has_otp = user.mfaToken is not None and user.mfaToken != ""

        return Response({
            "has_otp": has_otp
        }, status=status.HTTP_200_OK)
