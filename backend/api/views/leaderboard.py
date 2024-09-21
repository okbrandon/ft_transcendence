from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from ..models import User
from ..serializers import UserSerializer
from ..util import get_safe_profile
from ..validators import *

from .users import Stats


class Leaderboard(APIView):

	@staticmethod
	def get_leaderboard(period, order_by):
		users = User.objects.all()
		global_stats = {}

		for user in users:
			global_stats[user.userID] = Stats.get_user_stats(user, period)

		leaderboard_data = [
			{
				'user': get_safe_profile(UserSerializer(user).data, me=False),
				'stats': {
					'gamesPlayed': global_stats[user.userID]['stats']['gamesPlayed'],
					'gamesWon': global_stats[user.userID]['stats']['gamesWon'],
					'gamesLost': global_stats[user.userID]['stats']['gamesLost']
				}
			}
			for user in users
		]

		leaderboard_data.sort(key=lambda x: x['stats'][order_by], reverse=True)

		return leaderboard_data

	def get(self, request, *args, **kwargs):
		period = request.query_params.get('period', 'lifetime')
		requested_stats = request.query_params.get('stats', None)

		if not requested_stats:
			return Response({'error': 'No stats requested'}, status=status.HTTP_400_BAD_REQUEST)
		if requested_stats not in ['gamesPlayed', 'gamesWon', 'gamesLost']:
			return Response({'error': 'Invalid stats requested'}, status=status.HTTP_400_BAD_REQUEST)

		leaderboard = self.get_leaderboard(period, requested_stats)
		return Response(leaderboard, status=status.HTTP_200_OK)
