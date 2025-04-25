from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status

from server.methods.AuthCrud import AuthCrud


class CustomTokenView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        data = response.data
        username = request.data.get("username")
        reference_id = AuthCrud.Fetch_User_Repo_Reference(username)
        # Customizing the response

        data["username"] = username
        data["storageID"] = reference_id
        data["access"] = response.data.get("access")  # Include the access token
        data["refresh"] = response.data.get("refresh")  # Include the refresh token
        response.set_cookie(
            key="access_token",
            value=data["access"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,
        )

        response.set_cookie(
            key="refresh_token",
            value=data["refresh"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=30 * 24 * 60 * 60,  # 30 days,
        )
        return response
