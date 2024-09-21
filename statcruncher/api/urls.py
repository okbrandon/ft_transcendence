from django.urls import path

from .views.leaderboard import *

urlpatterns = [
	path('daily', Leaderboard.Daily.as_view(), name='leaderboard'), # GET
	path('weekly', Leaderboard.Weekly.as_view(), name='leaderboard'), # GET
	path('lifetime', Leaderboard.Lifetime.as_view(), name='leaderboard'), # GET
]
