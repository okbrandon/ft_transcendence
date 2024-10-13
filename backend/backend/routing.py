from django.urls import re_path

from api.consumers import ChatConsumer, MatchConsumer, StatusConsumer, TournamentConsumer

websocket_urlpatterns = [
	re_path(r'ws/chat/$', ChatConsumer.as_asgi()),
	re_path(r'ws/match', MatchConsumer.as_asgi()),
	re_path(r'ws/tournament', TournamentConsumer.as_asgi()),
	re_path(r'ws/status/$', StatusConsumer.as_asgi()),
]
