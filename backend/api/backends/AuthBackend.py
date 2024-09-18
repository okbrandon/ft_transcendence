import pyotp

from typing import Any

from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.base_user import AbstractBaseUser
from django.http import HttpRequest
from django.contrib.auth.hashers import check_password

from api.models import User

class AuthBackend(BaseBackend):
    def authenticate(self, request: HttpRequest, username: str | None = ..., password: str | None = ..., otp: str | None = ..., **kwargs: Any) -> AbstractBaseUser | None:
        try:
            user = User.objects.get(username=username)
            if user is not None:
                if user.mfaToken and not otp:
                    return None
                if user.mfaToken and otp:
                    totp = pyotp.TOTP(user.mfaToken)
                    if not totp.verify(otp, valid_window=6):
                        return None
                if check_password(password, user.password):
                    return user
        except User.DoesNotExist:
            return None