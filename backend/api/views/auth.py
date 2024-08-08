import re

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password

from ..models import User
from ..serializers import UserSerializer
from ..util import generate_id

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
            lang=data['lang']
        )
        serializer = UserSerializer(user)
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
        if len(password) > 128:
            raise ValidationError("Password cannot be longer than 128 characters.")
        if len(lang) != 2 or lang not in ['en', 'fr']:
            raise ValidationError("Unsupported language. Supported languages are 'en' and 'fr'.")

        return {
            "username": username,
            "email": email,
            "password": password,
            "lang": lang
        }