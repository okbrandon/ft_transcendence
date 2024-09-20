import pyotp
import os
import random
import string

from datetime import timedelta

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from django.db import models
from django.http import Http404, HttpResponse
from django.utils import timezone

from ..models import User, Match, Relationship, UserSettings
from ..serializers import UserSerializer, UserSettingsSerializer, MatchSerializer, RelationshipSerializer
from ..util import send_otp_via_sms, send_data_package_ready_email, get_safe_profile, generate_id
from ..validators import *

class UserProfileMe(APIView):
    def get(self, request, *args, **kwargs):
        me = request.user
        serializer = UserSerializer(me)
        data = serializer.data

        profile = get_safe_profile(data, me=True)
        return Response(profile, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        try:
            me = request.user
            data = request.data
            allowed_fields = ['username', 'displayName', 'bio', 'email', 'lang', 'avatarID', 'bannerID', 'phone_number', 'password']
            updated_fields = {}

            for field in allowed_fields:
                if field in data:
                    if field == 'username' and not validate_username(data[field]):
                        return Response({"error": "Invalid username. Username must be 4-16 characters long and contain only alphanumeric characters."}, status=status.HTTP_400_BAD_REQUEST)
                    elif field == 'displayName' and not validate_displayname(data[field]):
                        return Response({"error": "Invalid display name. Display name must be 4-16 characters long and contain only alphanumeric characters or null."}, status=status.HTTP_400_BAD_REQUEST)
                    elif field == 'email' and not validate_email(data[field]):
                        return Response({"error": "Invalid email. Email must be a valid format and no longer than 64 characters."}, status=status.HTTP_400_BAD_REQUEST)
                    elif field == 'lang' and not validate_lang(data[field]):
                        return Response({"error": "Invalid language. Supported languages are 'en', 'fr', and 'es'."}, status=status.HTTP_400_BAD_REQUEST)
                    elif field in ['avatarID', 'bannerID'] and not validate_image(data[field]):
                        return Response({"error": f"Invalid {field}. Image must be a valid base64 encoded string and no larger than 1MB."}, status=status.HTTP_400_BAD_REQUEST)
                    elif field == 'phone_number' and not validate_phone_number(data[field]):
                        return Response({"error": "Invalid phone number. Phone number must be in E.164 format (e.g., +1234567890)."}, status=status.HTTP_400_BAD_REQUEST)
                    elif field == 'password' and not validate_password(data[field]):
                        return Response({"error": "Invalid password. Password must be 8-72 characters long, contain at least one lowercase letter, one uppercase letter, one digit, and one special character."}, status=status.HTTP_400_BAD_REQUEST)

                    updated_fields[field] = data[field]

            if 'password' in updated_fields:
                if me.mfaToken:
                    otp = data.get('otp')
                    if not otp:
                        return Response({"error": "OTP is required to change password when MFA is enabled."}, status=status.HTTP_400_BAD_REQUEST)
                    totp = pyotp.TOTP(me.mfaToken)
                    if not totp.verify(otp):
                        return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
                updated_fields['password'] = make_password(updated_fields['password'])

            if 'phone_number' in updated_fields:
                send_otp_via_sms(updated_fields['phone_number'])

            for field, value in updated_fields.items():
                setattr(me, field, value)

            me.save()
            serializer = UserSerializer(me)
            profile = get_safe_profile(serializer.data, me=True)
            return Response(profile, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, *args, **kwargs):
        me = request.user
        new_username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=16))

        me.username = new_username
        me.displayName = None
        me.email = new_username + '@disabledaccount.com'
        me.mfaToken = None
        me.avatarID = None
        me.bannerID = None
        me.bio = 'This account has been permanently disabled.'
        me.oauthAccountID = None
        me.phone_number = None
        me.password = ""
        me.flags = 1<<2
        me.money = 0
        me.save()

        tokens = OutstandingToken.objects.filter(user=me)
        for token in tokens:
            _, _ = BlacklistedToken.objects.get_or_create(token=token)

        return Response(status=status.HTTP_204_NO_CONTENT)

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

        profile = get_safe_profile(serializer.data, me=False)
        return Response(profile, status=status.HTTP_200_OK)

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

        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request, *args, **kwargs):
        me = request.user
        me.flags = me.flags | (1 << 4)
        me.save()

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

        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request, *args, **kwargs):
        me = request.user
        me.flags = me.flags | (1 << 3)
        me.save()

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

        existing_relationship = (
            Relationship.objects.filter(userA=me.userID, userB=target_user_id).first() or
            Relationship.objects.filter(userA=target_user_id, userB=me.userID).first()
        )

        if relationship_type == 2:
            if existing_relationship and existing_relationship.status == 2:
                return Response({"error": "Relationship already blocked"}, status=status.HTTP_400_BAD_REQUEST)
            Relationship.objects.filter(userA=me.userID, userB=target_user_id).delete()
            Relationship.objects.filter(userA=target_user_id, userB=me.userID).delete()
            Relationship.objects.create(
                relationshipID=generate_id("rel"),
                userA=me.userID,
                userB=target_user_id,
                status=2
            )
            return Response({"status": "User blocked"}, status=status.HTTP_200_OK)

        if existing_relationship:
            if relationship_type == 0:
                return Response({"error": "Relationship already exists"}, status=status.HTTP_400_BAD_REQUEST)

            if existing_relationship.status == 2: # Blocked relationship gets unblocked
                existing_relationship.status = 1
                existing_relationship.save()
                return Response({"status": "User unblocked"}, status=status.HTTP_200_OK)

            if relationship_type == 1:
                if existing_relationship.status == 0 and existing_relationship.userB == me.userID:
                    existing_relationship.status = 1
                    existing_relationship.save()
                    return Response({"status": "Friend request accepted"}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Cannot directly set friendship status"}, status=status.HTTP_400_BAD_REQUEST)

        if relationship_type == 0:
            Relationship.objects.create(
                relationshipID=generate_id("rel"),
                userA=me.userID,
                userB=target_user_id,
                status=0
            )
            return Response({"status": "Friend request sent"}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid operation"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, relationshipID, *args, **kwargs):
        me = request.user

        # Find the relationship by ID
        relationship = get_object_or_404(
            Relationship,
            relationshipID=relationshipID
        )

        relationship.delete()

        return Response({"status": "Relationship deleted"}, status=status.HTTP_200_OK)

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

        profiles = get_safe_profile(serializer.data, me=False, many=True)
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

            send_data_package_ready_email(request.user.email)
            return response

class Stats():

    def get_user_stats(user, period):
        now = timezone.now()
        period_type = ['daily', 'weekly', 'lifetime']

        if period == 'daily':
            start_date = now - timedelta(days=1)
        elif period == 'weekly':
            start_date = now - timedelta(weeks=1)
        else: # Lifetime
            start_date = None

        matches = Match.objects.filter(models.Q(playerA__contains={'id': user.userID}) | models.Q(playerB__contains={'id': user.userID}))

        if start_date:
            matches = matches.filter(startedAt__gte=start_date)

        games_played = matches.count()
        games_won = 0
        games_lost = 0

        for match in matches:
            if match.winnerID == user.userID:
                games_won += 1
            else:
                games_lost += 1

        return {
            "userID": user.userID,
            "stats": {
                "gamesPlayed": games_played,
                "gamesWon": games_won,
                "gamesLost": games_lost
            },
            "period": {
                "type": period_type[period_type.index(period)] if period in period_type else "lifetime",
                "from": start_date,
                "to": now
            }
        }

    class UserMe(APIView):
        def get(self, request, *args, **kwargs):
            me = request.user
            period = request.query_params.get('period', None)
            stats = Stats.get_user_stats(me, period)
            return Response(stats, status=status.HTTP_200_OK)

    class User(APIView):
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

            period = request.query_params.get('period', None)
            stats = Stats.get_user_stats(user, period)
            return Response(stats, status=status.HTTP_200_OK)
