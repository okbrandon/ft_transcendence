from rest_framework import serializers
from .models import User, Match, Message, Token, Relationship, UserSettings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["userID", "username", "displayName", "email", "lang", 
                  "avatarID", "flags"]
        read_only_fields = ["userID", "username", "lang", "flags"]

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ["matchID", "playerA", "playerB", "scores", "startedAt", "finishedAt", "flags"]

class RelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relationship
        fields = ["relationshipID", "userA", "userB", "status", "flags"]

# Users can only update their display name, email, language, and avatar
class PartialUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["displayName", "email", "lang", "avatarID"]

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ["tokenID", "token", "revoked"]

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ["userID", "theme", "colorblind"]