from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from .views.auth import *
from .views.users import *
from .views.tournaments import *
from .views.internal import *
from .views.oauth import *
from .views.store import *
from .views.verification import *
from .views.conversations import *
from .views.leaderboard import *

from django.http import JsonResponse
from django.urls import path

class HealthCheck(APIView):
    def get(self, request, *args, **kwargs):
        return JsonResponse({"status": "healthy"}, status=200)

urlpatterns = [
    path('auth/register', AuthRegister.as_view()),
    path('auth/login', AuthLogin.as_view()),
    path('auth/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/totp/platform_availability', PlatformAvailability.as_view()),
    path('auth/totp/enable', EnableTOTP.as_view()),
    path('auth/totp/request', RequestTOTP.as_view()),
    path('auth/totp/delete', DeleteTOTP.as_view()),
    path('auth/totp', CheckOTP.as_view()),

    path('users/@me/profile', UserProfileMe.as_view()), # GET, PATCH, DELETE
    path('users/<identifier>/profile', UserProfile.as_view()), # GET
    path('users/@me/matches', UserMatchesMe.as_view()), # GET
    path('users/<userID>/matches', UserMatches.as_view()), # GET
    path('users/@me/settings', UserSettingsMe.as_view()), # GET, PATCH
    path('users/@me/exports', UserExports.as_view()), # GET
    path('users/@me/relationships', UserRelationshipsMe.as_view()), # GET, PUT
    path('users/@me/relationships/<str:relationshipID>', UserRelationshipsMe.as_view()),
    path('users/@me/harvest', UserHarvestMe.as_view()), # POST, GET, DELETE
    path('users/search', UserSearch.as_view()), # GET
    path('users/@me/stats', Stats.UserMe.as_view()), # GET
    path('users/<identifier>/stats', Stats.User.as_view()), # GET

    path('store/items', StoreItemsList.as_view()), # GET
    path('users/@me/purchases', UserPurchasesList.as_view()), # GET
    path('store/<itemID>/purchase', MakePurchase.as_view()), # POST

    path('auth/42/login', OAuth42Login.as_view()),
    path('auth/42/callback', OAuth42Callback.as_view()),

    path('verify', VerifyEmail.as_view()),

    # path('tournaments/<tournamentID>', TournamentInfo.as_view()), # GET, DELETE, PATCH
    # path('tournaments', TournamentCreate.as_view()), # POST

	path('chat/conversations', ConversationListView.as_view()),

    path('leaderboard', Leaderboard.as_view()), # GET

    path('__internal/check_user_exists/<userID>', CheckUserExists.as_view()), # GET
    path('__internal/create_match', CreateMatchHistory.as_view()), # POST

    path('health', HealthCheck.as_view()),
]
