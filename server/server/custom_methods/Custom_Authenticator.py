from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt  # or use your library of choice
from django.conf import settings

from server.models import UserModel


class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get("access_token")

        if not token:
            print("token not found")
            return None

        try:
            payload = jwt.decode(
                token, "custom_jwt_siging_key_for_now", algorithms=["HS256"]
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        try:
            user = UserModel.objects.get(id=payload["user_id"])
        except UserModel.DoesNotExist:
            raise AuthenticationFailed("User not found")

        return (user, None)
