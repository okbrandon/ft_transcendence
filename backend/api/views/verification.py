import base64

from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from django.utils import timezone

from ..models import User, VerificationCode
from ..serializers import VerificationCodeSerializer
from ..util import send_welcome_email

@permission_classes([AllowAny])
class VerifyEmail(APIView):
    def post(self, request, *args, **kwargs):
        code = request.data.get('code')

        if not code:
            return Response({"error": "Code is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_code = base64.urlsafe_b64decode(code).decode()
            user_id, unique_code = decoded_code.split('.')
            verification_code = VerificationCode.objects.get(code=unique_code, userID=user_id)
        except (VerificationCode.DoesNotExist, ValueError):
            return Response({"error": "Invalid or expired verification code."}, status=status.HTTP_400_BAD_REQUEST)

        if verification_code.expires_at < timezone.now():
            return Response({"error": "Verification code has expired."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(userID=user_id)
        user.flags |= 1  # Set the EMAIL_VERIFIED flag
        user.save()

        verification_code.delete()

        send_welcome_email(user.email)
        return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
