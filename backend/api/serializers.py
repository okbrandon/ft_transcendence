from rest_framework import serializers
from .models import User, Match, Message, Token, Relationship, UserSettings, StoreItem, Purchase, VerificationCode

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["userID", "username", "displayName", "email", "lang", 
                  "avatarID", "flags", "money", "mfaToken", "phone_number", "password", "bannerID", "bio", "oauthAccountID"]
        read_only_fields = ["userID", "username", "lang", "flags", "money", "mfaToken", "oauthAccountID"]

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ["matchID", "playerA", "playerB", "scores", "startedAt", "finishedAt", "flags"]

class RelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relationship
        fields = ["relationshipID", "userA", "userB", "status", "flags"]

class StoreItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreItem
        fields = ["itemID", "name", "description", "price"]

class VerificationCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationCode
        fields = ["userID", "code", "created_at", "expires_at"]
        read_only_fields = ["created_at", "expires_at"]


class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = ["purchaseID", "userID", "itemID", "purchaseDate"]

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