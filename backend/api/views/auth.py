import re
import base64
import pyotp

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

from ..models import User, VerificationCode
from ..serializers import UserSerializer
from ..util import generate_id, send_verification_email
from ..backends import AuthBackend


@permission_classes([AllowAny])
class AuthRegister(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = self.validate_request_data(request.data)
        except ValidationError as ex:
            return Response({"error": str(ex)}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=data['username']).exists():
            return Response({"error": "Username is already taken"}, status=status.HTTP_409_CONFLICT)
        
        if User.objects.filter(email=data['email']).exists():
            return Response({"error": "Email is already in use"}, status=status.HTTP_409_CONFLICT)

        user = User.objects.create(
            userID=generate_id('user'),
            username=data['username'],
            displayName=data['username'],
            email=data['email'],
            avatarID='default',
            password=make_password(data['password']),
            lang=data['lang'],
        )
        serializer = UserSerializer(user)

        verification_code = generate_id('code')
        VerificationCode.objects.create(
            userID=user.userID,
            code=verification_code,
            expires_at=timezone.now() + timezone.timedelta(hours=1)  # Code expires in 1 hour
        )
        verification_link = f"{os.environ.get('BASE_URL')}/verify?code={base64.urlsafe_b64encode(f'{user.userID}.{verification_code}'.encode()).decode()}"
        send_verification_email([data['email']], verification_link)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def validate_request_data(self, data):
        required_fields = {'username', 'email', 'password', 'lang'}
        if not all(field in data for field in required_fields):
            raise ValidationError("All fields ['username', 'email', 'password', 'lang'] are required.")

        username, email, password, lang = data['username'], data['email'], data['password'], data['lang']

        if len(username) < 4:
            raise ValidationError("Username must be at least 4 characters long.")
        if len(username) > 16:
            raise ValidationError("Username cannot be longer than 16 characters.")
        if len(email) > 64:
            raise ValidationError("Email cannot be longer than 64 characters.")
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValidationError("Invalid email address, did not match regex pattern.")
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters long.")
        if len(password.encode('utf-8')) > 72:
            raise ValidationError("Password cannot be longer than 72 bytes.")
        if len(lang) != 2 or lang not in ['en', 'fr', 'es']:
            raise ValidationError("Unsupported language. Supported languages are 'en', 'fr' or 'es'.")

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
            if user.oauthAccountID is not None:
                return Response({"error": "This is an OAuth account. Please login with your identity provider."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            pass

        user = AuthBackend.AuthBackend().authenticate(request, username=username, password=password, otp=otp)

        if user is None:
            return Response({"error": "Invalid credentials or OTP."}, status=status.HTTP_401_UNAUTHORIZED)

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
            return Response({"error": "TOTP is already enabled."}, status=status.HTTP_400_BAD_REQUEST)

        user.mfaToken = pyotp.random_base32()
        user.save()

        totp = pyotp.TOTP(user.mfaToken)
        return Response({"message": "TOTP enabled successfully.", "token": user.mfaToken}, status=status.HTTP_200_OK)

class ConfirmTOTP(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        otp = request.data.get('otp')

        if not otp:
            return Response({"error": "OTP is required."}, status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.TOTP(user.mfaToken)
        if totp.verify(otp):
            return Response({"message": "OTP confirmed successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

class DeleteTOTP(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        user.mfaToken = None
        user.save()
        return Response({"message": "MFA has been disabled."}, status=status.HTTP_200_OK)