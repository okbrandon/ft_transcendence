from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from ..models import Match, GameToken
from ..util import generate_id

class MatchCreate(APIView):

    def post(self, request, *args, **kwargs):
        match_type = request.data.get('type')
        user = request.user

        if match_type == 'ai':
            # Create an AI match
            match = Match.objects.create(
                matchID=generate_id("match"),
                playerA={"id": user.userID, "platform": "web"},
                playerB={"id": "ai", "platform": "server"},
                scores={},
                flags=1 << 1  # AI flag
            )
            game_token = generate_id("gtok")
            GameToken.objects.create(token=game_token, matchID=match.matchID, userID=user.userID)
            return Response({"game_token": game_token}, status=status.HTTP_201_CREATED)

        elif match_type == '1v1':
            # Try to find an available match
            available_match = Match.objects.filter(
                playerB__isnull=True,
                flags=0  # No AI flag
            ).first()

            if available_match:
                # Join existing match
                available_match.playerB = {"id": user.userID, "platform": "web"}
                available_match.save()
                game_token = generate_id("gtok")
                GameToken.objects.create(token=game_token, matchID=available_match.matchID, userID=user.userID)
                return Response({"game_token": game_token}, status=status.HTTP_201_CREATED)
            else:
                # Create new match
                new_match = Match.objects.create(
                    matchID=generate_id("match"),
                    playerA={"id": user.userID, "platform": "web"},
                    scores={},
                    flags=0
                )
                game_token = generate_id("gtok")
                GameToken.objects.create(token=game_token, matchID=new_match.matchID, userID=user.userID)
                return Response({"game_token": game_token}, status=status.HTTP_201_CREATED)

        return Response({"error": "Invalid match type"}, status=status.HTTP_400_BAD_REQUEST)
