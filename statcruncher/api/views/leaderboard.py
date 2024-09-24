import logging

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

from ..backends.database import StatDatabase
from ..backends.statcruncher import StatCruncher

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

database = StatDatabase()
statcruncher = StatCruncher(database)

class Leaderboard():

	@staticmethod
	def get_leaderboard_response(period, requested_stats):
		global statcruncher

		if not requested_stats:
			return Response({'error': 'No stats requested'}, status=status.HTTP_400_BAD_REQUEST)
		if requested_stats not in ['gamesPlayed', 'gamesWon', 'gamesLost']:
			return Response({'error': 'Invalid stats requested'}, status=status.HTTP_400_BAD_REQUEST)

		leaderboard = statcruncher.get_leaderboard(period, requested_stats)
		return Response(leaderboard, status=status.HTTP_200_OK)

	class Daily(APIView):

		@method_decorator(cache_page(60 * 2, key_prefix='leaderboard'))
		def get(self, request, *args, **kwargs):
			period = request.query_params.get('period', 'lifetime')
			requested_stats = request.query_params.get('stats', None)

			return Leaderboard.get_leaderboard_response(period, requested_stats)

	class Weekly(APIView):

		@method_decorator(cache_page(60 * 2, key_prefix='leaderboard'))
		def get(self, request, *args, **kwargs):
			period = request.query_params.get('period', 'lifetime')
			requested_stats = request.query_params.get('stats', None)

			return Leaderboard.get_leaderboard_response(period, requested_stats)

	class Lifetime(APIView):

		@method_decorator(cache_page(60 * 2, key_prefix='leaderboard'))
		def get(self, request, *args, **kwargs):
			period = request.query_params.get('period', 'lifetime')
			requested_stats = request.query_params.get('stats', None)

			return Leaderboard.get_leaderboard_response(period, requested_stats)