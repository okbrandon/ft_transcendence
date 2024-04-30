from rest_framework import serializers
from .models import User, Match, Message, Token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["userID", "username", "displayName", "email", "lang", 
                  "avatarID", "flags"]

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ["tokenID", "token", "revoked"]