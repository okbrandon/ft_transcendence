from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

class Bot(APIView):

	def post(self, request, *args, **kwargs):
		host = request.data.get('host', 'localhost')
		port = request.data.get('port', 8080)
		match_id = request.data.get('matchID', None)

		if not match_id:
			return Response({'error': 'Match ID is required'}, status=status.HTTP_400_BAD_REQUEST)
		if not host or not port or port < 0 or port > 65535:
			return Response({'error': 'Invalid host or port'}, status=status.HTTP_400_BAD_REQUEST)

		# Do something with the data
		return Response({'success': True}, status=status.HTTP_200_OK)
