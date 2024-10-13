from django.db import models
from django.contrib.auth.models import AbstractUser

from .util import generate_id

class Match(models.Model):
    matchID = models.CharField(max_length = 48, unique=True)
    playerA = models.JSONField(null=True) # ex: {"id": "user_202020202020", "platform": "terminal"}
    playerB = models.JSONField(null=True)
    scores = models.JSONField(default=dict) # ex: {"user_202020202020": 5, "user_202020202021", 3}
    winnerID = models.CharField(max_length = 48, null=True)
    startedAt = models.DateTimeField(auto_now_add=True)
    finishedAt = models.DateTimeField(null=True)
    flags = models.IntegerField(default=0) # 1<<0 = AI, 1<<1 = 1v1

    def __str__(self):
        return self.matchID

class GameToken(models.Model):
    token = models.CharField(max_length=48, unique=True)
    matchID = models.CharField(max_length=48)
    userID = models.CharField(max_length=48)

    def __str__(self):
        return self.matchID

class StoreItem(models.Model):
    itemID = models.CharField(max_length=48, unique=True)
    name = models.CharField(max_length=100)
    assetID = models.TextField(null=True, blank=True)
    price = models.IntegerField()

    def __str__(self):
        return self.itemID

class Purchase(models.Model):
    purchaseID = models.CharField(max_length=48, unique=True)
    userID = models.CharField(max_length=48)
    itemID = models.CharField(max_length=48)
    purchaseDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.purchaseID

class User(AbstractUser):
    userID = models.CharField(max_length=48, unique=True)
    username = models.CharField(max_length = 16, unique=True)
    displayName = models.CharField(max_length = 64, null = True)
    email = models.CharField(max_length = 64)
    mfaToken = models.CharField(max_length = 128, null = True)
    lang = models.CharField(max_length = 6)
    avatarID = models.TextField(null=True)  # Store base64 encoded image as text
    bannerID = models.TextField(null=True)
    bio = models.TextField(null=True, max_length=280)
    oauthAccountID = models.TextField(null=True, max_length=64)
    # passwords should be limited to 72 **bytes** because of a bcrypt limitation
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    password = models.CharField(max_length = 128)
    flags = models.IntegerField(default = 0) # 1 << 0 = EMAIL_VERIFIED, 1 << 1 = IS_AI, 1 << 2 = ACCOUNT_DISABLED, 1<<3 = SCHEDULED_HARVESTING
    money = models.IntegerField(default = 0)
    status = models.JSONField(null=True) # ex: {"online": True, "activity": "PLAYING", "last_seen": "2021-01-01T00:00:00Z"}
    xp = models.IntegerField(default = 0)

    # Override the groups and user_permissions to avoid field clashes
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="user_set_custom",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="user_set_custom",
        related_query_name="user",
    )

    def __str__(self):
        return self.userID

class VerificationCode(models.Model):
    userID = models.CharField(max_length=48)
    code = models.CharField(max_length=48)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"VerificationCode(userID={self.userID}, code={self.code})"


class UserSettings(models.Model):
    userID = models.CharField(max_length = 48, unique = True)
    selectedPaddleSkin = models.CharField(max_length = 48, null = True)

    def __str__(self):
        return self.userID

class Conversation(models.Model):
    conversationID = models.CharField(primary_key=True, max_length=48, default="", editable=False)
    conversationType = models.CharField(max_length=50, default='private_message')  # Can be expanded for different types
    receipientID = models.CharField(max_length=48, null=True)
    participants = models.ManyToManyField(User, related_name='conversations')

    def __str__(self):
        return str(self.conversationID)

class Message(models.Model):
    messageID = models.CharField(primary_key=True, max_length=48, default="", editable=False)
    conversation = models.ForeignKey(Conversation, null=True, related_name='messages', on_delete=models.CASCADE)
    content = models.CharField(max_length=256)
    sender = models.ForeignKey(User, null=True, related_name='sent_messages', on_delete=models.CASCADE)
    createdAt = models.DateTimeField(null=True, auto_now_add=True)
    messageType = models.IntegerField(default=0)

    def __str__(self):
        return f"Message(messageID={self.messageID}, conversationID={self.conversation.conversationID})"

class Relationship(models.Model):
    relationshipID = models.CharField(max_length = 48)
    userA = models.CharField(max_length = 48)
    userB = models.CharField(max_length = 48)
    # for evan from the future: I don't like it being called status, "type" would be better
    # but im too lazy to do db migrations
    status = models.IntegerField(default = 0) # 0 = pending, 1 = accepted, 2 = blocked

    def __str__(self):
        return self.relationshipID

class Token(models.Model):
    tokenID = models.CharField(max_length = 48)
    token = models.CharField(max_length = 256)
    revoked = models.BooleanField(default = False)

    def __str__(self):
        return self.token
