from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from ..backends.bot_program import BotProgram

class Bot(APIView):

	def post(self, request, *args, **kwargs):
		host = request.data.get('host', 'backend')
		port = request.data.get('port', 8443)
		match_id = request.data.get('matchID', None)

		if not match_id:
			return Response({'error': 'Match ID is required'}, status=status.HTTP_400_BAD_REQUEST)
		if not host or not int(port) or int(port) < 0 or int(port) > 65535:
			return Response({'error': 'Invalid host or port'}, status=status.HTTP_400_BAD_REQUEST)

		BotProgram(host=host, port=port, matchID=match_id)
		return Response({'success': True}, status=status.HTTP_200_OK)
