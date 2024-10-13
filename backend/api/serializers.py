from rest_framework import serializers

from .models import User, Match, Message, Conversation, Token, Relationship, UserSettings, StoreItem, Purchase, VerificationCode, Tournament
from .util import get_safe_profile

class UserSerializer(serializers.ModelSerializer):
    status = serializers.JSONField()

    class Meta:
        model = User
        fields = ["userID", "username", "displayName", "email", "mfaToken", "lang",
                  "avatarID", "bannerID", "bio", "oauthAccountID", "phone_number", "password", "flags", "money", "status", "xp"]
        read_only_fields = ["userID", "mfaToken", "oauthAccountID", "flags", "money"]

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ["matchID", "playerA", "playerB", "scores", "winnerID", "startedAt", "finishedAt", "flags"]
        read_only_fields = ["matchID", "startedAt", "finishedAt"]

class RelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relationship
        fields = ["relationshipID", "userA", "userB", "status"]

class StoreItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreItem
        fields = ["itemID", "name", "assetID", "price"]

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
        fields = ["userID", "selectedPaddleSkin"]

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()

    class Meta:
        model = Message
        fields = ['messageID', 'messageType', 'content', 'sender', 'createdAt']

class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True)
    messages = MessageSerializer(many=True)

    class Meta:
        model = Conversation
        fields = ['conversationID', 'conversationType', 'receipientID', 'participants', 'messages']

class TournamentSerializer(serializers.ModelSerializer):
    participants = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = ['tournamentID', 'name', 'startDate', 'endDate', 'maxParticipants', 'participants', 'status', 'winnerID', 'createdAt', 'isPublic']

    def get_participants(self, obj):
        return [get_safe_profile(UserSerializer(participant).data, me=False) for participant in obj.participants.all()]
