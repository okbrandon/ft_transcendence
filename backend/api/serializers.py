from rest_framework import serializers
from .models import User, Match, Message

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["userID", "username", "display_name", "email", "lang", 
                  "avatarID", "flags"]
        