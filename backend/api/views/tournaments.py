from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from ..models import Tournament
from ..serializers import TournamentSerializer
from ..util import generate_id
from datetime import datetime, timezone as pytz_timezone

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

        try:
            tournament = Tournament.objects.create(
                tournamentID=generate_id("tournament"),
                name=name,
                startDate=start_date,
                isPublic=is_public,
                maxParticipants=max_participants,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TournamentSerializer(tournament)
        return Response(serializer.data, status=status.HTTP_201_CREATED)