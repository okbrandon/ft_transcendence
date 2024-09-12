import requests
import os
from django.conf import settings
from django.shortcuts import redirect
from django.http import JsonResponse
from rest_framework.views import APIView
from django.contrib.auth import login
from ..models import User
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from ..util import generate_id, send_welcome_email

@permission_classes([AllowAny])
class OAuth42Login(APIView):
    def get(self, request):
        authorization_url = f"{settings.OAUTH2_AUTHORIZATION_URL}?client_id={settings.OAUTH2_CLIENT_ID}&redirect_uri={settings.OAUTH2_REDIRECT_URI}&response_type=code"
        return redirect(authorization_url)

@permission_classes([AllowAny])
class OAuth42Callback(APIView):
    def get(self, request):
        code = request.GET.get('code')
        token_response = requests.post(settings.OAUTH2_TOKEN_URL, data={
            'client_id': settings.OAUTH2_CLIENT_ID,
            'client_secret': settings.OAUTH2_CLIENT_SECRET,
            'redirect_uri': settings.OAUTH2_REDIRECT_URI,
            'code': code,
            'grant_type': 'authorization_code'
        })

        if token_response.status_code != 200:
            print("Error obtaining access token from 42 API, did the secret expire?")
            return JsonResponse({"error": "Failed to obtain access token"}, status=status.HTTP_400_BAD_REQUEST)

        token_data = token_response.json()
        access_token = token_data.get('access_token')

        user_info_response = requests.get('https://api.intra.42.fr/v2/me', headers={
            'Authorization': f'Bearer {access_token}'
        })

        if user_info_response.status_code != 200:
            return JsonResponse({"error": "Failed to retrieve user information"}, status=status.HTTP_400_BAD_REQUEST)

        user_info = user_info_response.json()
        user, created = User.objects.get_or_create(oauthAccountID=user_info['id'], defaults={
            'username': user_info['login'],
            'userID': generate_id('user'),
            'email': user_info['email'],
            'displayName': user_info['usual_full_name'],
            'avatarID': user_info['image']['link'] if 'image' in user_info else None,
            'lang': 'en',
            'oauthAccountID': user_info['id'],
            'flags': 1, # EMAIL_VERIFIED
        })

        login(request, user)

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        send_welcome_email(user.email)

        base_url = os.getenv('BASE_URL')
        return redirect(f'{base_url}/callback?token={access}&refresh={str(refresh)}')
