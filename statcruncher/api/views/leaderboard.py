import logging

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

from ..apps import STATCRUNCHER

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Leaderboard():

	@staticmethod
	def get_leaderboard_response(period, requested_stats):
		if not requested_stats:
			return Response({'error': 'No stats requested'}, status=status.HTTP_400_BAD_REQUEST)
		if requested_stats not in ['gamesPlayed', 'gamesWon', 'gamesLost']:
			return Response({'error': 'Invalid stats requested'}, status=status.HTTP_400_BAD_REQUEST)

		leaderboard = STATCRUNCHER.get_leaderboard(period, requested_stats)
		return Response(leaderboard, status=status.HTTP_200_OK)

	class Daily(APIView):

		@method_decorator(cache_page(60 * 2, key_prefix='leaderboard'))
		def get(self, request, *args, **kwargs):
			requested_stats = request.query_params.get('stats', None)

			return Leaderboard.get_leaderboard_response("daily", requested_stats)

	class Weekly(APIView):

		@method_decorator(cache_page(60 * 2, key_prefix='leaderboard'))
		def get(self, request, *args, **kwargs):
			requested_stats = request.query_params.get('stats', None)

			return Leaderboard.get_leaderboard_response("weekly", requested_stats)

	class Lifetime(APIView):

		@method_decorator(cache_page(60 * 2, key_prefix='leaderboard'))
		def get(self, request, *args, **kwargs):
			requested_stats = request.query_params.get('stats', None)

			return Leaderboard.get_leaderboard_response("lifetime", requested_stats)
