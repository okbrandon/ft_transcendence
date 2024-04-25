from django.db import models
from django.contrib.auth.models import User

class Match(models.Model):
    matchID = models.CharField(max_length = 48)
    playerA = models.JSONField # ex: {"id": "user_202020202020", "platform": "terminal"}
    playerB = models.JSONField 
    scores = models.JSONField # ex: {"user_202020202020": 5, "user_202020202021", 3}
    startedAt = models.DateTimeField
    finishedAt = models.DateTimeField
    flags = models.IntegerField # is AI game = 0x1

    def __str__(self):
        return self.matchID

class User(models.Model):
    userID = models.CharField(max_length = 48)
    username = models.CharField(max_length = 16)
    display_name = models.CharField(max_length = 16)
    email = models.CharField(max_length = 64)
    mfa_token = models.CharField(max_length = 32)
    lang = models.CharField(max_length = 6)
    avatarID = models.CharField(max_length = 68)
    # passwords should be limited to 72 **bytes** because of a bcrypt limitation
    password = models.CharField(max_length = 128)
    flags = models.IntegerField

    def __str__(self):
        return self.userID

class Message(models.Model):
    messageID = models.CharField(max_length = 48)
    content = models.CharField(max_length = 256)
    authorID = models.CharField(max_length = 48)

    def __str__(self):
        return self.messageID