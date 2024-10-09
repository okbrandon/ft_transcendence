from django.urls import path

from .views.bot import Bot

urlpatterns = [
	path('connect', Bot.as_view(), name='bot'),
]
