import requests

from rest_framework.views import APIView
from rest_framework.response import Response

from ..validators import *


class Leaderboards:

	class Daily(APIView):
		def get(self, request, *args, **kwargs):
			requested_stats = request.query_params.get('stats', None)

			if not requested_stats:
				return Response({"error": "No stats requested"}, status=400)

			response = requests.get('https://statcruncher:9000/leaderboard/daily' + '?stats=' + requested_stats, verify=False)
			return Response(response.json() if response else {}, status=response.status_code)

	class Weekly(APIView):
		def get(self, request, *args, **kwargs):
			requested_stats = request.query_params.get('stats', None)

			if not requested_stats:
				return Response({"error": "No stats requested"}, status=400)

			response = requests.get('https://statcruncher:9000/leaderboard/weekly' + '?stats=' + requested_stats, verify=False)
			return Response(response.json() if response else {}, status=response.status_code)

	class Lifetime(APIView):
		def get(self, request, *args, **kwargs):
			requested_stats = request.query_params.get('stats', None)

			if not requested_stats:
				return Response({"error": "No stats requested"}, status=400)

			response = requests.get('https://statcruncher:9000/leaderboard/lifetime' + '?stats=' + requested_stats, verify=False)
			return Response(response.json() if response else {}, status=response.status_code)
