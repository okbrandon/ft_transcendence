from rest_framework import serializers

from .models import User, Match, Message, Conversation, Token, Relationship, UserSettings, StoreItem, Purchase, VerificationCode

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["userID", "username", "displayName", "email", "mfaToken", "lang", 
                  "avatarID", "bannerID", "bio", "oauthAccountID", "phone_number", "password", "flags", "money"]
        read_only_fields = ["userID", "mfaToken", "oauthAccountID", "flags", "money"]

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ["matchID", "playerA", "playerB", "scores", "startedAt", "finishedAt", "flags"]

class RelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relationship
        fields = ["relationshipID", "userA", "userB", "status"]

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

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()

    class Meta:
        model = Message
        fields = ['messageID', 'content', 'sender', 'createdAt']

class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True)
    messages = MessageSerializer(many=True)

    class Meta:
        model = Conversation
        fields = ['conversationID', 'conversationType', 'participants', 'messages']