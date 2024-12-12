import pyotp
import os
import random
import string
import logging

from datetime import timedelta

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

from django.contrib.auth.hashers import make_password, check_password
from django.shortcuts import get_object_or_404
from django.db import models, transaction
from django.db.models import Count
from django.http import Http404, HttpResponse
from django.utils import timezone

from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync

from ..models import User, Match, Relationship, UserSettings, Purchase, StoreItem, ChallengeInvite, Conversation
from ..serializers import UserSerializer, UserSettingsSerializer, MatchSerializer, RelationshipSerializer, MessageSerializer, ChallengeInviteSerializer
from ..util import get_safe_profile, generate_id
from ..validators import *

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
                if field in data and data[field] != '':
                    if field == 'username' and me.oauthAccountID and data[field] != me.username:
                        return Response({"error": "Cannot change username for OAuth accounts."}, status=status.HTTP_400_BAD_REQUEST)
                    elif field == 'username' and data[field] != me.username:
                        if not validate_username(data[field]):
                            return Response({"error": "Invalid username. Username must be 4-16 characters long and contain only alphanumeric characters and cannot end with '42'."}, status=status.HTTP_400_BAD_REQUEST)
                        if User.objects.filter(username=data[field]).exclude(id=me.id).exists():
                            return Response({"error": "Username is already taken"}, status=status.HTTP_409_CONFLICT)
                    elif field == 'displayName' and not validate_displayname(data[field]):
                        return Response({"error": "Invalid display name. Display name must be 4-16 characters long and contain only alphanumeric characters or null."}, status=status.HTTP_400_BAD_REQUEST)
                    elif field == 'bio' and not validate_bio(data[field]):
                        return Response({"error": "Invalid bio. Bio must be 280 characters or less."}, status=status.HTTP_400_BAD_REQUEST)
                    elif field == 'email':
                        if not validate_email(data[field]):
                            return Response({"error": "Invalid email. Email must be a valid format and no longer than 64 characters."}, status=status.HTTP_400_BAD_REQUEST)
                        if User.objects.filter(email=data[field]).exclude(id=me.id).exists():
                            return Response({"error": "Email is already in use"}, status=status.HTTP_409_CONFLICT)
                    elif field == 'lang' and not validate_lang(data[field]):
                        return Response({"error": "Invalid language. Supported languages are 'EN', 'FR', and 'ES'."}, status=status.HTTP_400_BAD_REQUEST)
                    elif field in ['avatarID', 'bannerID'] and not validate_image(data[field]):
                        return Response({"error": f"Invalid {field}. Image must be a valid base64 encoded string and no larger than 1MB."}, status=status.HTTP_400_BAD_REQUEST)
                    elif field == 'phone_number' and not validate_phone_number(data[field]):
                        return Response({"error": "Invalid phone number. Phone number must be in E.164 format (e.g., +1234567890)."}, status=status.HTTP_400_BAD_REQUEST)
                    elif field == 'password' and not validate_password(data[field]):
                        return Response({"error": "Invalid password. Password must be 8-72 characters long, contain at least one lowercase letter, one uppercase letter, one digit, and one special character."}, status=status.HTTP_400_BAD_REQUEST)

                    updated_fields[field] = data[field]

            sensitive_fields = ['password', 'phone_number', 'email']
            changed_sensitive_fields = [field for field in sensitive_fields if field in updated_fields]

            for field in changed_sensitive_fields:
                if field == 'password':
                    if not check_password(updated_fields[field], me.password):
                        changed_sensitive_fields.remove(field)
                elif getattr(me, field) == updated_fields[field]:
                    changed_sensitive_fields.remove(field)

            if changed_sensitive_fields and me.mfaToken:
                otp = data.get('otp')
                if not otp:
                    return Response({"error": "OTP is required to change sensitive information when MFA is enabled."}, status=status.HTTP_400_BAD_REQUEST)
                totp = pyotp.TOTP(me.mfaToken)
                if not totp.verify(otp, valid_window=6):
                    return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

            if 'password' in updated_fields:
                updated_fields['password'] = make_password(updated_fields['password'])

            for field, value in updated_fields.items():
                setattr(me, field, value)

            me.save()
            serializer = UserSerializer(me)
            profile = get_safe_profile(serializer.data, me=True)
            return Response(profile, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        me.status = None
        me.xp = 0
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
        profile = get_safe_profile(serializer.data, me=False)

        # Check relationship status with the requesting user
        me = request.user
        relationship = Relationship.objects.filter(
            (models.Q(userA=me.userID) & models.Q(userB=user.userID)) |
            (models.Q(userA=user.userID) & models.Q(userB=me.userID))
        ).first()

        if relationship:
            if relationship.status == 0:
                profile['relationship'] = 'pending'
            elif relationship.status == 1:
                profile['relationship'] = 'friends'
            elif relationship.status == 2:
                profile['relationship'] = 'blocked'
        else:
            profile['relationship'] = None

        return Response(profile, status=status.HTTP_200_OK)

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
        settings, created = UserSettings.objects.get_or_create(userID=me)
        serializer = UserSettingsSerializer(settings)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        me = request.user
        data = request.data
        settings, created = UserSettings.objects.get_or_create(userID=me)

        if 'selectedPaddleSkin' in data:
            new_skin_id = data['selectedPaddleSkin']

            # Check if the user has purchased the skin
            if new_skin_id is not None:
                try:
                    skin_item = StoreItem.objects.get(itemID=new_skin_id)
                    purchase = Purchase.objects.filter(userID=me.userID, itemID=skin_item.itemID).exists()
                    if not purchase:
                        return Response({"error": "You haven't purchased this paddle skin."}, status=status.HTTP_403_FORBIDDEN)
                except StoreItem.DoesNotExist:
                    return Response({"error": "Invalid paddle skin ID."}, status=status.HTTP_400_BAD_REQUEST)

            settings.selectedPaddleSkin = new_skin_id

        settings.save()
        serializer = UserSettingsSerializer(settings)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserSettingsOther(APIView):
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
        settings, created = UserSettings.objects.get_or_create(userID=user)
        serializer = UserSettingsSerializer(settings)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserRelationshipsMe(APIView):

    def get(self, request, *args, **kwargs):
        me = request.user
        relationships = Relationship.objects.filter(userA=me.userID) | Relationship.objects.filter(userB=me.userID)

        serializer = RelationshipSerializer(relationships, many=True, context={'request': request})

        # Process the serialized data to include both the sender and target user's profile
        processed_relationships = []
        for relationship in serializer.data:
            sender_id = relationship['userA']
            target_id = relationship['userB']
            sender = User.objects.get(userID=sender_id)
            target = User.objects.get(userID=target_id)
            sender_serializer = UserSerializer(sender)
            target_serializer = UserSerializer(target)
            processed_relationship = {
                'relationshipID': relationship['relationshipID'],
                'status': relationship['status'],
                'sender': get_safe_profile(sender_serializer.data, me=False),
                'target': get_safe_profile(target_serializer.data, me=False)
            }
            processed_relationships.append(processed_relationship)

        return Response(processed_relationships, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        me = request.user
        target_user_id = request.data.get("user")
        relationship_type = request.data.get("type")

        if not target_user_id or relationship_type is None:
            return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

        if target_user_id == "user_ai":
            return Response({"error": "There's no escaping prune, nice try."}, status=status.HTTP_400_BAD_REQUEST)
        if target_user_id == me.userID:
            return Response({"error": "You cannot create a relationship with yourself"}, status=status.HTTP_400_BAD_REQUEST)

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

            if relationship_type == 1:
                if existing_relationship.status == 0 and existing_relationship.userB == me.userID:
                    existing_relationship.status = 1
                    existing_relationship.save()
                    self.notify_chat_websocket(existing_relationship, status="accepted")
                    return Response({"status": "Friend request accepted"}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Cannot directly set friendship status"}, status=status.HTTP_400_BAD_REQUEST)

        if relationship_type == 0:
            relationship = Relationship.objects.create(
                relationshipID=generate_id("rel"),
                userA=me.userID,
                userB=target_user_id,
                status=0
            )
            self.notify_chat_websocket(relationship, status="pending")
            return Response({"status": "Friend request sent"}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid operation"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, relationshipID, *args, **kwargs):
        me = request.user

        # Find the relationship by ID
        relationship = get_object_or_404(
            Relationship,
            relationshipID=relationshipID
        )

        # Check if the user is part of the relationship
        if me.userID != relationship.userA and me.userID != relationship.userB:
            return Response({"error": "You are not part of this relationship"}, status=status.HTTP_403_FORBIDDEN)

        if relationship.userA == "user_ai" or relationship.userB == "user_ai":
            return Response({"error": "There's no escaping prune, nice try."}, status=status.HTTP_400_BAD_REQUEST)

        if relationship.status == 0:
            if me.userID != relationship.userA:
                self.notify_chat_websocket(relationship, status="rejected")

        self.notify_chat_websocket(relationship, status="deleted")

        relationship.delete()

        return Response({"status": "Relationship deleted"}, status=status.HTTP_200_OK)

    def notify_chat_websocket(self, relationship, status):
        channel_layer = get_channel_layer()

        if status == "accepted" or status == "rejected":
            group_names = [f"chat_{relationship.userA}"]
        elif status == "pending":
            group_names = [f"chat_{relationship.userB}"]
        elif status == "deleted":
            group_names = [f"chat_{relationship.userA}", f"chat_{relationship.userB}"]
        else:
            return

        try:
            from_user = User.objects.get(userID=relationship.userA)
        except User.DoesNotExist:
            return

        try:
            to_user = User.objects.get(userID=relationship.userB)
        except User.DoesNotExist:
            return

        for group_name in group_names:
            try:
                async_to_sync(channel_layer.group_send)(
                    group_name,
                    {
                        "type": "friend_request",
                        "status": status,
                        "data": {
                            "type": "relationship",
                            "relationshipID": relationship.relationshipID,
                            "from": get_safe_profile(UserSerializer(from_user).data, me=False),
                            "to": get_safe_profile(UserSerializer(to_user).data, me=False)
                        }
                    }
                )
            except Exception as _:
                logger.error(f"Failed to send friend request notification. Group: {group_name}")

class UserMatches(APIView):
    def get(self, request, userID, *args, **kwargs):
        user = User.objects.get(userID=userID)
        matches = Match.objects.filter(
            models.Q(playerA__id=user.userID) | models.Q(playerB__id=user.userID),
            finishedAt__isnull=False
        )

        tempered_matches = []
        for match in matches:
            match_data = MatchSerializer(match).data
            serialized_playerA = UserSerializer(User.objects.get(userID=match_data['playerA']['id'])).data
            serialized_playerB = UserSerializer(User.objects.get(userID=match_data['playerB']['id'])).data
            match_playerA = get_safe_profile(serialized_playerA, me=False)
            match_playerB = get_safe_profile(serialized_playerB, me=False)

            tempered_matches.append({
                "matchID": match_data['matchID'],
                "playerA": match_playerA,
                "playerB": match_playerB,
                "scores": match_data['scores'],
                "winnerID": match_data['winnerID'],
                "startedAt": match_data['startedAt'],
                "finishedAt": match_data['finishedAt'],
                "flags": match_data['flags']
            })

        tempered_matches.sort(key=lambda x: x['finishedAt'], reverse=True)
        return Response(tempered_matches, status=status.HTTP_200_OK)

class UserMatchesMe(APIView):
    def get(self, request, *args, **kwargs):
        me = request.user
        matches = Match.objects.filter(
            models.Q(playerA__id=me.userID) | models.Q(playerB__id=me.userID),
            finishedAt__isnull=False
        )

        tempered_matches = []
        for match in matches:
            match_data = MatchSerializer(match).data
            serialized_playerA = UserSerializer(User.objects.get(userID=match_data['playerA']['id'])).data
            serialized_playerB = UserSerializer(User.objects.get(userID=match_data['playerB']['id'])).data
            match_playerA = get_safe_profile(serialized_playerA, me=False)
            match_playerB = get_safe_profile(serialized_playerB, me=False)

            tempered_matches.append({
                "matchID": match_data['matchID'],
                "playerA": match_playerA,
                "playerB": match_playerB,
                "scores": match_data['scores'],
                "winnerID": match_data['winnerID'],
                "startedAt": match_data['startedAt'],
                "finishedAt": match_data['finishedAt'],
                "flags": match_data['flags']
            })

        tempered_matches.sort(key=lambda x: x['finishedAt'], reverse=True)
        return Response(tempered_matches, status=status.HTTP_200_OK)

class UserSearch(APIView):
    def get(self, request, *args, **kwargs):
        content = request.query_params.get('content', None)
        if not content:
            return Response({"error": "No search content provided"}, status=status.HTTP_400_BAD_REQUEST)

        me = request.user
        # blocked_users = Relationship.objects.filter(
        #     models.Q(userA=me.userID, status=2) | models.Q(userB=me.userID, status=2)
        # ).values_list('userA', 'userB')

        # blocked_user_ids = [user for pair in blocked_users for user in pair if user != me.userID]

        users = User.objects.filter(
            models.Q(displayName__icontains=content) | models.Q(username__icontains=content)
        )

        serializer = UserSerializer(users, many=True)

        profiles = get_safe_profile(serializer.data, me=False, many=True)
        return Response(profiles, status=status.HTTP_200_OK)

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

class Stats():

    @staticmethod
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

        matches = matches.annotate(
            win=models.Count(models.Case(
                models.When(models.Q(winnerID=user.userID) & ~models.Q(winnerID__isnull=True), then=1),
                output_field=models.PositiveIntegerField()
            )),
            loss=models.Count(models.Case(
                models.When(~models.Q(winnerID=user.userID) & ~models.Q(winnerID__isnull=True), then=1),
                output_field=models.PositiveIntegerField()
            ))
        )

        games_played = matches.count()
        games_won = matches.filter(win=1).count()
        games_lost = matches.filter(loss=1).count()

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

class UserChallenge(APIView):

    def get_object(self, identifier):
        try:
            return User.objects.get(models.Q(userID=identifier) | models.Q(username=identifier))
        except User.DoesNotExist:
            return None

    def post(self, request, identifier, *args, **kwargs):
        inviter = request.user
        invitee = self.get_object(identifier)

        if not invitee:
            return Response({"error": "User does not exist"},
                            status=status.HTTP_404_NOT_FOUND)
        if invitee.userID == inviter.userID:
            return Response({"error": "You cannot challenge yourself"},
                            status=status.HTTP_400_BAD_REQUEST)
        if invitee.userID == "user_ai":
            return Response({"error": "Challenge Prune via the matchmaking system"},
                            status=status.HTTP_400_BAD_REQUEST)

        blocked = Relationship.objects.filter(
            models.Q(userA=invitee.userID, userB=inviter.userID, status=2) |
            models.Q(userA=inviter.userID, userB=invitee.userID, status=2)
        ).exists()

        if blocked:
            return Response({"error": "Relationship does not allow this challenge"},
                            status=status.HTTP_403_FORBIDDEN)

        channel_layer = get_channel_layer()
        invite = ChallengeInvite.objects.create(
            inviteID=generate_id("cid"),
            inviter=inviter,
            invitee=invitee,
            status='PENDING'
        )
        invite.save()

        # Create or get conversation for the invite
        existing_conversation = Conversation.objects.filter(
            participants__userID__in=[inviter.userID, invitee.userID],
            conversationType='private_message'
        ).annotate(participant_count=Count('participants')).filter(participant_count=2).exists()

        if not existing_conversation:
            new_conversation = Conversation.objects.create(conversationID=generate_id("conv"), conversationType='private_message')
            new_conversation.receipientID = inviter.userID
            new_conversation.participants.add(inviter, invitee)
            new_conversation.save()
            conversation = new_conversation
        else:
            conversation = Conversation.objects.filter(
                participants__userID__in=[inviter.userID, invitee.userID],
                conversationType='private_message'
            ).annotate(participant_count=Count('participants')).filter(participant_count=2).first()

        # Send a message to the invitee
        message = conversation.messages.create(messageID=generate_id("msg"), sender=inviter, content="I've challenged you to a match!")
        message.messageType = 3
        message.challengeInvite = invite
        message.save()
        conversation.save()

        safe_profile = get_safe_profile(UserSerializer(inviter).data, me=False)

        # Send message to channel layer
        async_to_sync(channel_layer.group_send)(
            f"chat_{invitee.userID}",
            {
                "type": "conversation_update",
                "conversationID": conversation.conversationID,
                "sender": safe_profile,
                "message": MessageSerializer(message).data
            }
        )

        return Response({"status": "Challenge invite sent"}, status=status.HTTP_200_OK)

class UserChallengeInviteResponse(APIView):

    def get_object(self, identifier):
        try:
            return User.objects.get(models.Q(userID=identifier) | models.Q(username=identifier))
        except User.DoesNotExist:
            return None

    @transaction.atomic
    def post(self, request, identifier, inviteID, action):
        if action not in ['accept', 'deny']:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        invitee = request.user
        inviter = self.get_object(identifier)
        channel_layer = get_channel_layer()

        if not inviter:
            return Response({"error": "User does not exist"},
                            status=status.HTTP_404_NOT_FOUND)
        if inviter.userID == invitee.userID:
            return Response({"error": "Abnormal behavior detected"},
                            status=status.HTTP_400_BAD_REQUEST)

        invite = ChallengeInvite.objects.filter(
            inviteID=inviteID,
        ).first()

        # Check if the invitation is valid
        if not invite:
            return Response({"error": "Invite does not exist"},
                            status=status.HTTP_404_NOT_FOUND)

        if invite.status != 'PENDING':
            return Response({"error": "Invite is not pending"},
                            status=status.HTTP_400_BAD_REQUEST)

        # Check if the inviter is available to play
        if inviter.status['online'] != True:
            return Response({"error": "Inviter is not online"},
                            status=status.HTTP_400_BAD_REQUEST)
        if inviter.status['activity'] != 'HOME':
            return Response({"error": "Inviter is not free to play"},
                            status=status.HTTP_400_BAD_REQUEST)

        # Check if the invitee is available to play
        if invitee.status['online'] != True:
            return Response({"error": "Invitee is not online"},
                            status=status.HTTP_400_BAD_REQUEST)
        if invitee.status['activity'] != 'HOME':
            return Response({"error": "Invitee is not free to play"},
                            status=status.HTTP_400_BAD_REQUEST)

        # Action processing
        if action == 'accept':
            invite.status = 'ACCEPTED'
            invite.save()

            new_match = Match.objects.create(
                matchID=generate_id("match"),
                # playerA={"id": inviter.userID, "platform": "web"},
                winnerID=None,
                scores={},
                finishedAt=None,
                flags=5
            )
            new_match.whitelist.add(inviter, invitee)
            new_match.save()

            # Avert the inviter that the challenge has been accepted
            async_to_sync(channel_layer.group_send)(
                f"chat_{inviter.userID}",
                {
                    "type": "challenge_update",
                    "invite": ChallengeInviteSerializer(invite).data
                }
            )

            message = "Invite accepted and joined the match successfully"
        else:
            invite.status = 'DECLINED'
            invite.save()

            # Avert the inviter that the challenge has been denied
            async_to_sync(channel_layer.group_send)(
                f"chat_{inviter.userID}",
                {
                    "type": "challenge_update",
                    "invite": ChallengeInviteSerializer(invite).data
                }
            )

            message = "Invite declined successfully"

        # Updating the invitation message to type 0 (basic message)
        conversation = Conversation.objects.filter(
            participants__userID__in=[inviter.userID, invitee.userID],
            conversationType='private_message'
        ).annotate(participant_count=Count('participants')).filter(participant_count=2).first()

        if conversation:
            conv_message = conversation.messages.filter(challengeInvite__inviteID__exact=inviteID).first()

            if conv_message:
                conv_message.messageType = 0
                conv_message.save()
                conversation.save()

        return Response({"status": message}, status=status.HTTP_200_OK)
