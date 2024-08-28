import pyotp
import os

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.hashers import make_password
from django.db import models
from django.http import Http404, HttpResponse

from ..log import log_to_discord
from ..models import User, Match, Relationship, UserSettings
from ..serializers import UserSerializer, UserSettingsSerializer, MatchSerializer, RelationshipSerializer
from ..util import send_otp_via_sms

class UserProfileMe(APIView):
    def get(self, request, *args, **kwargs):
        me = request.user
        serializer = UserSerializer(me)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        me = request.user
        data = request.data
        allowed_fields = ['displayName', 'username', 'email', 'mfaToken', 'lang', 'avatarID', 'password', 'phone_number', 'bannerID', 'bio']
        updated_fields = {}

        for field in allowed_fields:
            if field in data:
                updated_fields[field] = data[field]

        if 'password' in updated_fields:
            updated_fields['password'] = make_password(updated_fields['password'])

        if 'avatarID' in updated_fields:
            avatar_data = updated_fields['avatarID']
            if len(avatar_data) > 1 * 1024 * 1024:  # Check if the base64 string is larger than 1MB
                return Response({"error": "Avatar image size exceeds 2MB limit"}, status=status.HTTP_400_BAD_REQUEST)
            updated_fields['avatarID'] = avatar_data

        if 'phone_number' in updated_fields:
            send_otp_via_sms(updated_fields['phone_number'])

        for field, value in updated_fields.items():
            setattr(me, field, value)

        me.save()
        serializer = UserSerializer(me)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserProfile(APIView):
    def get_object(self, identifier):
        try:
            return User.objects.get(models.Q(userID=identifier) | models.Q(username=identifier))
        except User.DoesNotExist:
            return None

    def get(self, request, identifier, *args, **kwargs):
        user = self.get_object(identifier)
        if not user:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserSerializer(user)
        data = serializer.data
        if 'email' in data:
            del data['email']
        return Response(data, status=status.HTTP_200_OK)

class UserMatches(APIView):
    def get(self, request, userID, *args, **kwargs):
        user = User.objects.get(userID=userID)
        matches = Match.objects.all()
        matches = [match for match in matches if match.playerA['id'] == user.userID or match.playerB['id'] == user.userID]
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserDeleteMe(APIView):
    def get(self, request, *args, **kwargs):
        me = request.user
        return Response({"scheduled_deletion": me.flags & (1 << 4) == (1 << 4)}, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        me = request.user

        if me.flags & (1 << 4) != (1 << 4):
            return Response({"error": "User is not scheduled for deletion"}, status=status.HTTP_400_BAD_REQUEST)

        me.flags = me.flags & ~(1 << 4)
        me.save()

        log_to_discord(f"User account {me.userID} has retracted their request for anonymization")
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request, *args, **kwargs):
        me = request.user
        me.flags = me.flags | (1 << 4)
        me.save()

        log_to_discord(f"User account {me.userID} has been flagged for anonymization")
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserHarvestMe(APIView):
    def get(self, request, *args, **kwargs):
        me = request.user
        return Response({"scheduled_harvesting": me.flags & (1 << 3) == (1 << 3)}, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        me = request.user

        if me.flags & (1 << 3) != (1 << 3):
            return Response({"error": "User is not scheduled for harvesting"}, status=status.HTTP_400_BAD_REQUEST)

        me.flags = me.flags & ~(1 << 3)
        me.save()

        log_to_discord(f"User account {me.userID} has retracted their data export request")
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request, *args, **kwargs):
        me = request.user
        me.flags = me.flags | (1 << 3)
        me.save()

        log_to_discord(f"User account {me.userID} has been flagged for data export")
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserSettingsMe(APIView):
    def get(self, request, *args, **kwargs):
        me = request.user
        settings = UserSettings.objects.get(user=me)
        serializer = UserSettingsSerializer(settings)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        me = request.user
        data = request.data
        allowed_fields = ['theme', 'colorblind']
        updated_fields = {}
        for field in allowed_fields:
            if field in data:
                updated_fields[field] = data[field]
        for field, value in updated_fields.items():
            setattr(me, field, value)

        me.save()
        serializer = UserSettingsSerializer(me)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserRelationshipsMe(APIView):
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

class UserMatchesMe(APIView):
    def get(self, request, *args, **kwargs):
        me = request.user
        matches = Match.objects.all()
        matches = [match for match in matches if match.playerA['id'] == me.userID or match.playerB['id'] == me.userID]
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserSearch(APIView):
    def get(self, request, *args, **kwargs):
        content = request.query_params.get('content', None)
        if not content:
            return Response({"error": "No search content provided"}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(models.Q(displayName__icontains=content) | models.Q(username__icontains=content))
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserExports(APIView):
    def get(self, request, *args, **kwargs):
        user_id = request.user.userID
        export_dir = '/exports'
        user_export_file = os.path.join(export_dir, f"{user_id}.zip")

        if not os.path.exists(user_export_file):
            raise Http404("Export file not found.")

        with open(user_export_file, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename="{user_id}.zip"'
            return response
