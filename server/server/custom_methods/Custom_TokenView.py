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

        return Response(data, status=status.HTTP_200_OK)
