from rest_framework import serializers

from .models import User, Match, Message, Conversation, Token, Relationship, UserSettings, StoreItem, Purchase, VerificationCode, Tournament, TournamentInvite, ChallengeInvite
from .util import get_safe_profile

class UserSerializer(serializers.ModelSerializer):
    status = serializers.JSONField()

    class Meta:
        model = User
        fields = ["userID", "username", "displayName", "email", "mfaToken", "lang",
                  "avatarID", "bannerID", "bio", "oauthAccountID", "phone_number", "password", "flags", "money", "status", "xp"]
        read_only_fields = ["userID", "mfaToken", "oauthAccountID", "flags", "money"]

class MatchSerializer(serializers.ModelSerializer):
    whitelist = UserSerializer(many=True)

    class Meta:
        model = Match
        fields = ["matchID", "playerA", "playerB", "scores", "winnerID", "startedAt", "finishedAt", "flags", "whitelist"]
        read_only_fields = ["matchID", "startedAt", "finishedAt"]

    def validate_whitelist(self, value):
        if len(value) > 2:
            raise serializers.ValidationError("Only two users are allowed in the whitelist.")
        return value

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

class TournamentSerializer(serializers.ModelSerializer):
    participants = serializers.SerializerMethodField()
    owner = UserSerializer()

    class Meta:
        model = Tournament
        fields = ['tournamentID', 'name', 'startDate', 'endDate', 'maxParticipants', 'participants', 'status', 'winnerID', 'createdAt', 'isPublic', 'owner']

    def get_participants(self, obj):
        return [get_safe_profile(UserSerializer(participant).data, me=False) for participant in obj.participants.all()]

class TournamentInviteSerializer(serializers.ModelSerializer):
    tournament = TournamentSerializer()
    inviter = UserSerializer()
    invitee = UserSerializer()

    class Meta:
        model = TournamentInvite
        fields = ['inviteID', 'tournament', 'inviter', 'invitee', 'status', 'createdAt']

class ChallengeInviteSerializer(serializers.ModelSerializer):
    inviter = UserSerializer()
    invitee = UserSerializer()

    class Meta:
        model = ChallengeInvite
        fields = ['inviteID', 'inviter', 'invitee', 'status']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    tournamentInvite = TournamentInviteSerializer()
    challengeInvite = ChallengeInviteSerializer()

    class Meta:
        model = Message
        fields = ['messageID', 'content', 'sender', 'messageType', 'tournamentInvite', 'challengeInvite', 'createdAt']

class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True)
    messages = MessageSerializer(many=True)

    class Meta:
        model = Conversation
        fields = ['conversationID', 'conversationType', 'receipientID', 'participants', 'messages']
