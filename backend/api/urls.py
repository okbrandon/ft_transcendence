from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from .views.auth import *
from .views.users import *
from .views.tournaments import *
from .views.oauth import *
from .views.store import *
from .views.verification import *
from .views.conversations import *
from .views.leaderboards import *

from django.http import JsonResponse
from django.urls import path

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
    path('users/<identifier>/settings', UserSettingsOther.as_view()), # GET
    path('users/@me/exports', UserExports.as_view()), # GET
    path('users/@me/relationships', UserRelationshipsMe.as_view()), # GET, PUT
    path('users/@me/relationships/<str:relationshipID>', UserRelationshipsMe.as_view()),
    path('users/@me/harvest', UserHarvestMe.as_view()), # POST, GET, DELETE
    path('users/search', UserSearch.as_view()), # GET
    path('users/@me/stats', Stats.UserMe.as_view()), # GET
    path('users/<identifier>/stats', Stats.User.as_view()), # GET
    path('users/<identifier>/challenge', UserChallenge.as_view()), # POST
    path('users/<identifier>/challenge/<str:inviteID>/<str:action>', UserChallengeInviteResponse.as_view()), # POST

    path('store/items', StoreItemsList.as_view()), # GET
    path('users/@me/purchases', UserPurchasesList.as_view()), # GET
    path('store/<itemID>/purchase', MakePurchase.as_view()), # POST

    path('auth/42/login', OAuth42Login.as_view()),
    path('auth/42/callback', OAuth42Callback.as_view()),

    path('verify', VerifyEmail.as_view()),

    path('leaderboards/daily', Leaderboards.Daily.as_view()), # GET
    path('leaderboards/weekly', Leaderboards.Weekly.as_view()), # GET
    path('leaderboards/lifetime', Leaderboards.Lifetime.as_view()), # GET

	path('chat/conversations', ConversationListView.as_view()),

    path('tournaments', Tournaments.as_view()),
    path('tournaments/@me', UserCurrentTournament.as_view()),
    path('tournaments/<str:tournamentID>', TournamentDetail.as_view()),
    path('tournaments/<str:tournamentID>/join', JoinPublicTournament.as_view()),
    path('tournaments/<str:tournamentID>/invite', Tournaments.as_view()),
    path('tournaments/<str:tournamentID>/invite/<str:action>', TournamentInviteResponse.as_view()),
    path('tournaments/<str:tournamentID>/kick', KickUserFromTournament.as_view()),
    path('tournaments/<str:tournamentID>/start', ForceTournamentStart.as_view()),
]
