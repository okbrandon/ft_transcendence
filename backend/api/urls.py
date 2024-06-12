from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from .views import (
    UserProfileApiView, UserRegisterApiView, UserLoginApiView,
    MeProfileApiView, UserMatchesApiView, MeRelationshipsApiView,
    MeMatchesApiView
)

urlpatterns = [
    path('auth/register', UserRegisterApiView.as_view()),
    path('auth/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),

    path('users/@me/profile', MeProfileApiView.as_view()), # GET, PATCH
    path('users/<userID>/profile', UserProfileApiView.as_view()), # GET
    path('users/@me/matches', MeMatchesApiView.as_view()), # GET
    path('users/<userID>/matches', UserMatchesApiView.as_view()), # GET
    # path('users/@me/settings', MeSettingsApiView.as_view()), # GET, PATCH
    path('users/@me/relationships', MeRelationshipsApiView.as_view()), # GET, PUT
    # path('users/@me/harvest', MeHarvestApiView.as_view()), # POST, GET
    # path('users/@me/delete', MeDeleteApiView.as_view()), # POST, GET
]