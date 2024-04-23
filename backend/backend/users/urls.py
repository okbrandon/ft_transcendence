from django.urls import path
from . import views

urlpatterns = [
    path('users/@me', views.get_me, name='get_me'),
    path('users/@me/delete', views.delete_me, name='delete_me'),
    path('users/@me/settings', views.update_settings, name='update_settings'),
    path('users/<str:user_id>/profile', views.get_profile, name='get_profile'),
    path('users/@me/relationships', views.get_relationships, name='get_relationships'),
    path('users/@me/status', views.update_status, name='update_status'),
    path('users/@me/harvest', views.harvest, name='harvest'),
    path('users/@me/anonymise', views.anonymise, name='anonymise'),
    path('users/<str:user_id>/match-history', views.get_match_history, name='get_match_history'),
    path('auth', views.auth, name='auth'),
]
