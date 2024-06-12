import re

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework import permissions
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login, get_user_model
from django.db.models import Q
from .models import User, Message, Match, Token, Relationship
from .serializers import UserSerializer, TokenSerializer, PartialUserUpdateSerializer, MatchSerializer, RelationshipSerializer
from .util import generate_id, generate_jwt

class UserProfileApiView(APIView):
    def get_object(self, user_id):
        try:
            return User.objects.get(userID=user_id)
        except User.DoesNotExist:
            return None

    def get(self, request, userID, *args, **kwargs):
        user = self.get_object(userID)
        if not user:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserMatchesApiView(APIView):
    def get(self, request, userID, *args, **kwargs):
        user = User.objects.get(userID=userID)
        matches = Match.objects.filter(playerA__id__contains=user.userID) | Match.objects.filter(playerB__id__contains=user.userID)
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class MeProfileApiView(APIView):
    def get(self, request, *args, **kwargs):
        me = request.user
        serializer = UserSerializer(me)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        me = request.user
        serializer = UserSerializer(me, data=request.data, partial=True)  # Allow partial updates

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MeRelationshipsApiView(APIView):
    def get(self, request, *args, **kwargs):
        me = request.user
        relationships = Relationship.objects.filter(userA=me.userID) | Relationship.objects.filter(userB=me.userID)

        # Exclude blocked relationships where the user is the blocked user, for privacy reasons
        relationships = relationships.exclude(status=2, userB=me.userID)

        serializer = RelationshipSerializer(relationships, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        me = request.user
        target_user_id = request.data.get("user")
        relationship_type = request.data.get("type")

        if not target_user_id or relationship_type is None:
            return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            target_user = User.objects.get(userID=target_user_id)
        except User.DoesNotExist:
            return Response({"error": "Target user does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        # If either user is blocking the other, update or create a blocked relationship
        if relationship_type == 2:
            Relationship.objects.filter(userA=me.userID, userB=target_user_id).delete()
            Relationship.objects.filter(userA=target_user_id, userB=me.userID).delete()
            Relationship.objects.create(userA=me.userID, userB=target_user_id, status=2)
            return Response({"status": "User blocked"}, status=status.HTTP_200_OK)
        
        # Check if there is an existing relationship from the target user
        existing_relationship = Relationship.objects.filter(userA=target_user_id, userB=me.userID).first()
        if existing_relationship and existing_relationship.status != 2:
            if relationship_type == 0:
                return Response({"error": "Friend request already exists"}, status=status.HTTP_400_BAD_REQUEST)
            elif relationship_type == 1:
                existing_relationship.status = 1
                existing_relationship.save()
                return Response({"status": "You are now friends"}, status=status.HTTP_200_OK)
        
        # Check if there is an existing relationship initiated by the current user
        existing_relationship = Relationship.objects.filter(userA=me.userID, userB=target_user_id).first()
        if existing_relationship and existing_relationship.status != 2:
            if relationship_type == 0 and existing_relationship.status == 0:
                return Response({"error": "Friend request already sent"}, status=status.HTTP_400_BAD_REQUEST)
            elif relationship_type == 1 and existing_relationship.status == 0:
                existing_relationship.status = 1
                existing_relationship.save()
                return Response({"status": "You are now friends"}, status=status.HTTP_200_OK)

        # Create a new relationship
        Relationship.objects.create(userA=me.userID, userB=target_user_id, status=relationship_type)
        message = "Friend request sent" if relationship_type == 0 else "You are now friends"
        return Response({"status": message}, status=status.HTTP_200_OK)
    
@permission_classes([AllowAny])
class UserRegisterApiView(APIView):
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
    
@permission_classes([AllowAny])
class UserLoginApiView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = self.validate_request_data(request.data)
        except ValidationError as ex:
            return Response({"error": str(ex)}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            login(request, user)
            token = Token.objects.create(tokenID=generate_id('token'), token=generate_jwt(user.userID), revoked=False)
            return Response({"token": token.token}, status=status.HTTP_200_OK)

    def validate_request_data(self, data):
        required_fields = {'username', 'password'}
        if not all(field in data for field in required_fields):
            raise ValidationError("All fields ['username', 'password'] are required.")

        username, password = data['username'], data['password']

        if len(username) > 64:
            raise ValidationError("Username cannot be longer than 64 characters.")
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters long.")
        if len(password) > 128:
            raise ValidationError("Password cannot be longer than 128 characters.")

        return {
            "username": username,
            "password": password
        }
    
class MeMatchesApiView(APIView):

    def get(self, request, *args, **kwargs):
        me = request.user
        matches = Match.objects.filter(playerA__contains={"id": me.userID}) | Match.objects.filter(playerB__contains={"id": me.userID})
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)