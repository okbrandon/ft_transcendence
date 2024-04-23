"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from backend.users import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users/@me', views.get_me)
router.register(r'users/@me/delete', views.delete_me)
router.register(r'users/@me/settings', views.update_settings)
router.register(r'users/<str:user_id>/profile', views.get_profile)
router.register(r'users/@me/relationships', views.get_relationships)
router.register(r'users/@me/status', views.update_status)
router.register(r'users/@me/harvest', views.harvest_me)
router.register(r'users/@me/anonymise', views.anonymise_me)
router.register(r'users/<str:user_id>/match-history', views.get_match_history)

urlpatterns = [
    path('', include(router.urls)),
    path('api/', include('rest_framework.urls', namespace='rest_framework'))
]
