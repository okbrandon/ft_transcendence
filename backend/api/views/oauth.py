import requests
import os
import base64

from django.conf import settings
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth import login

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from ..util import generate_id, send_welcome_email
from ..models import User, Relationship

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
        encoded_avatar = None

        if 'image' in user_info:
            avatar_data = requests.get(user_info['image']['link']).content
            avatar_path = f"avatar_{user_info['login']}.jpg"
            media_root = settings.MEDIA_ROOT

            if not os.path.exists(media_root):
                os.makedirs(media_root)

            # Save the avatar to the media root
            with open(f'{media_root}/{avatar_path}', 'wb') as f:
                f.write(avatar_data)

            # Encode the avatar to base64
            with open(f'{media_root}/{avatar_path}', 'rb') as f:
                encoded_avatar = base64.b64encode(f.read()).decode('utf-8')

            os.remove(f'{media_root}/{avatar_path}')

        user, created = User.objects.get_or_create(oauthAccountID=user_info['id'], defaults={
            'username': user_info['login'] + '42',
            'userID': generate_id('user'),
            'email': user_info['email'],
            'avatarID': f"data:image/jpeg;base64,{encoded_avatar}" if encoded_avatar else None,
            'lang': 'EN',
            'oauthAccountID': user_info['id'],
            'flags': 1, # EMAIL_VERIFIED
        })

        if created:
            send_welcome_email(user.email)
            # Create a relationship with the AI user
            Relationship.objects.create(
                relationshipID=generate_id("rel"),
                userA=user.userID,
                userB="user_ai",
                status=1  # Accepted/friends status
            )

        login(request, user)

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        return redirect(f'{settings.BASE_URL}/callback?token={access}&refresh={str(refresh)}')
