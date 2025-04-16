import os
from dotenv import load_dotenv
import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.shortcuts import redirect

load_dotenv()


@api_view(["GET"])
def dropbox_oauth(request):
    client_id = os.getenv(
        "DROPBOX_APP_KEY"
    )  # Replace with your Dropbox app's client ID
    redirect_uri = "http://127.0.0.1:8000/api/dropbox/oauth/callback"  # Callback URI you configured in Dropbox
    scope = (
        "files.content.read files.content.write files.metadata.read account_info.read"
    )

    auth_url = (
        "https://www.dropbox.com/oauth2/authorize"
        f"?client_id={client_id}"
        "&response_type=code"
        f"&redirect_uri={redirect_uri}"
        f"&scope={scope}"
        "&token_access_type=offline"
        "&force_reapprove=true"
    )

    return redirect(auth_url)


@api_view(["GET"])
def dropbox_oauth_callback(request):
    code = request.GET.get("code")  # Dropbox sends the code as a GET parameter

    if not code:
        return Response({"error": "No code received"}, status=400)

    client_id = os.getenv("DROPBOX_APP_KEY")
    client_secret = os.getenv("DROPBOX_APP_SECRET")
    redirect_uri = "http://127.0.0.1:8000/api/dropbox/oauth/callback"

    # Exchange the code for an access token
    token_url = "https://api.dropboxapi.com/oauth2/token"
    data = {
        "code": code,
        "grant_type": "authorization_code",
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
    }

    response = requests.post(token_url, data=data)

    if response.status_code != 200:
        return Response(
            {"error": "Failed to get token", "details": response.json()}, status=500
        )

    # Extract access and refresh tokens
    tokens = response.json()
    access_token = tokens.get("access_token")
    refresh_token = tokens.get("refresh_token")
    print("Granted scopes:", tokens.get("scope"))
    # Return tokens (in practice, you would save them to the database)
    return Response({"access_token": access_token, "refresh_token": refresh_token})
