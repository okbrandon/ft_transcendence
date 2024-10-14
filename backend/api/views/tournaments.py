from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from ..models import Tournament, TournamentInvite, User, Conversation
from ..serializers import TournamentSerializer
from ..util import generate_id, get_safe_profile
from datetime import datetime, timezone as pytz_timezone, timedelta
from django.db import transaction
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Tournaments(APIView):
    def get(self, request):
        # Get all public tournaments that haven't started yet
        current_time = datetime.now(pytz_timezone.utc)
        pending_tournaments = Tournament.objects.filter(
            isPublic=True,
            status='PENDING',
            startDate__gt=current_time
        )

        serializer = TournamentSerializer(pending_tournaments, many=True)
        
        # Modify the serialized data to use get_safe_profile for participants
        safe_data = []
        for tournament in serializer.data:
            tournament['participants'] = [get_safe_profile(participant, me=False) for participant in tournament['participants']]
            safe_data.append(tournament)
        
        return Response(safe_data, status=status.HTTP_200_OK)

    def post(self, request):
        name = request.data.get('name')
        start_date = request.data.get('startDate')
        is_public = request.data.get('isPublic')
        max_participants = request.data.get('maxParticipants', 8)

        if not all([name, start_date, is_public is not None]):
            return Response({"error": "Missing mandatory fields"}, status=status.HTTP_400_BAD_REQUEST)

        if len(name) > 16:
            return Response({"error": "Tournament name is too long"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            start_date = datetime.fromisoformat(start_date).replace(tzinfo=pytz_timezone.utc)
            now = datetime.now(pytz_timezone.utc)
            if start_date < now + timezone.timedelta(hours=1):
                return Response({"error": "Start date must be at least 1 hour in the future"}, status=status.HTTP_400_BAD_REQUEST)
            if start_date > now + timezone.timedelta(hours=24):
                return Response({"error": "Start date cannot be more than 24 hours in the future"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Invalid start date format"}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(max_participants, int) or max_participants <= 0:
            return Response({"error": "Invalid max participants"}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(is_public, bool):
            return Response({"error": "Invalid is_public value"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user is already subscribed to a tournament
        if Tournament.objects.filter(participants=request.user, status='PENDING').exists():
            return Response({"error": "You are already subscribed to a tournament"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tournament = Tournament.objects.create(
                tournamentID=generate_id("tournament"),
                name=name,
                startDate=start_date,
                isPublic=is_public,
                maxParticipants=max_participants,
                owner=request.user
            )
            tournament.participants.add(request.user)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TournamentSerializer(tournament)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def put(self, request, tournamentID):
        try:
            tournament = Tournament.objects.get(tournamentID=tournamentID)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)

        inviter = request.user
        invitee_ids = request.data.get('participants', [])

        if not invitee_ids:
            return Response({"error": "No participants provided"}, status=status.HTTP_400_BAD_REQUEST)

        channel_layer = get_channel_layer()

        for invitee_id in invitee_ids:
            try:
                invitee = User.objects.get(userID=invitee_id)
            except User.DoesNotExist:
                return Response({"error": f"User {invitee_id} not found"}, status=status.HTTP_404_NOT_FOUND)

            # Check if the invitee is already subscribed to a tournament
            if Tournament.objects.filter(participants=invitee, status='PENDING').exists():
                return Response({"error": f"User {invitee.username} is already subscribed to a tournament"}, status=status.HTTP_400_BAD_REQUEST)

            invite = TournamentInvite.objects.create(
                inviteID=generate_id("tid"),
                tournament=tournament,
                inviter=inviter,
                invitee=invitee
            )

            conversation, created = Conversation.objects.get_or_create(
                conversationType='private_message',
                participants=User.objects.filter(userID__in=[inviter.userID, invitee.userID])
            )

            message = conversation.messages.create(
                messageID=generate_id("msg"),
                content=invite.inviteID,
                sender=inviter,
                messageType=1
            )

            # Send message to channel layer
            async_to_sync(channel_layer.group_send)(
                f"chat_{invitee.userID}",
                {
                    "type": "conversation_update",
                    "senderUsername": inviter.username,
                    "messagePreview": "sent a tournament invite"
                }
            )

        return Response({"message": "Invitations sent successfully"}, status=status.HTTP_200_OK)


class UserCurrentTournament(APIView):
    def get(self, request):
        try:
            tournament = Tournament.objects.filter(
                participants=request.user,
                status='PENDING'
            ).first()

            if tournament:
                serializer = TournamentSerializer(tournament)
                safe_data = serializer.data
                safe_data['participants'] = [get_safe_profile(participant, me=False) for participant in tournament.participants.all()]
                return Response(safe_data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "User is not currently subscribed to any tournament"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class TournamentDetail(APIView):
    def get(self, request, tournamentID):
        try:
            tournament = Tournament.objects.get(tournamentID=tournamentID)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TournamentSerializer(tournament)
        
        # Modify the serialized data to use get_safe_profile for participants
        safe_data = serializer.data        
        return Response(safe_data, status=status.HTTP_200_OK)

class KickUserFromTournament(APIView):
    @transaction.atomic
    def post(self, request, tournamentID):
        try:
            tournament = Tournament.objects.get(tournamentID=tournamentID)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user != tournament.owner:
            return Response({"error": "Only the tournament owner can kick users"}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_kick = User.objects.get(userID=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if user_to_kick not in tournament.participants.all():
            return Response({"error": "User is not a participant in this tournament"}, status=status.HTTP_400_BAD_REQUEST)

        tournament.participants.remove(user_to_kick)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"tournament_{tournamentID}",
            {
                "type": "tournament_kick",
                "user": get_safe_profile(user_to_kick, me=False)
            }
        )

        return Response({"message": f"User {user_to_kick.username} has been kicked from the tournament"}, status=status.HTTP_200_OK)

class ForceTournamentStart(APIView):
    def post(self, request, tournamentID):
        try:
            tournament = Tournament.objects.get(tournamentID=tournamentID)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user != tournament.owner:
            return Response({"error": "Only the tournament owner can force start the tournament"}, status=status.HTTP_403_FORBIDDEN)

        #TODO: implement
        return Response({"message": "Tournament force start initiated"}, status=status.HTTP_200_OK)


class TournamentInviteResponse(APIView):
    @transaction.atomic
    def post(self, request, tournamentID, action):
        if action not in ['accept', 'deny']:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tournament = Tournament.objects.get(tournamentID=tournamentID)
            invite = TournamentInvite.objects.get(tournament=tournament, invitee=request.user, status='PENDING')
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)
        except TournamentInvite.DoesNotExist:
            return Response({"error": "Invite not found"}, status=status.HTTP_404_NOT_FOUND)

        channel_layer = get_channel_layer()

        current_time = timezone.now()
        if tournament.startDate <= current_time + timedelta(minutes=1):
            return Response({"error": "Tournament has already started or is about to start"}, status=status.HTTP_400_BAD_REQUEST)

        if tournament.participants.count() >= tournament.maxParticipants:
            return Response({"error": "Tournament is full"}, status=status.HTTP_400_BAD_REQUEST)

        if action == 'accept':
            # Check if the user is already subscribed to a tournament
            if Tournament.objects.filter(participants=request.user, status='PENDING').exists():
                return Response({"error": "You are already subscribed to a tournament"}, status=status.HTTP_400_BAD_REQUEST)

            invite.status = 'ACCEPTED'
            invite.save()
            tournament.participants.add(request.user)
            async_to_sync(channel_layer.group_send)(
                f"tournament_{tournamentID}",
                {
                    "type": "tournament_join",
                    "user": get_safe_profile(request.user, me=False)
                }
            )
            message = "Invite accepted and joined tournament successfully"
        else:
            invite.status = 'DECLINED'
            invite.save()
            message = "Invite declined successfully"

        return Response({"message": message}, status=status.HTTP_200_OK)



class JoinPublicTournament(APIView):
    @transaction.atomic
    def post(self, request, tournamentID):
        try:
            tournament = Tournament.objects.get(tournamentID=tournamentID)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)

        if not tournament.isPublic:
            return Response({"error": "This tournament is not public"}, status=status.HTTP_400_BAD_REQUEST)

        current_time = timezone.now()
        if tournament.startDate <= current_time + timedelta(minutes=1):
            return Response({"error": "Tournament has already started or is about to start"}, status=status.HTTP_400_BAD_REQUEST)

        if tournament.participants.count() >= tournament.maxParticipants:
            return Response({"error": "Tournament is full"}, status=status.HTTP_400_BAD_REQUEST)

        if request.user in tournament.participants.all():
            return Response({"error": "You are already a participant in this tournament"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user is already subscribed to a tournament
        if Tournament.objects.filter(participants=request.user, status='PENDING').exists():
            return Response({"error": "You are already subscribed to a tournament"}, status=status.HTTP_400_BAD_REQUEST)

        tournament.participants.add(request.user)
        return Response({"message": "Successfully joined the tournament"}, status=status.HTTP_200_OK)