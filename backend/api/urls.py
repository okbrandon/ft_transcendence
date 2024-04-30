from django.urls import path
from .views import (
    UserProfileApiView, UserRegisterApiView, UserLoginApiView
)

urlpatterns = [
    path('users/<userID>/profile', UserProfileApiView.as_view()),
    path('auth/login', UserLoginApiView.as_view()),
    path('auth/register', UserRegisterApiView.as_view()),
]