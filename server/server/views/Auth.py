from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action


from server.methods.AuthCrud import AuthCrud
from django.db import IntegrityError
from rest_framework import status

from server.models import UserModel
from server.utils.ResponseBody import ResponseBody


class AuthView(ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=["POST"])
    def register_user(self, req: Request):
        try:
            response = AuthCrud.register_user(req.data)
            return Response(response["response"], status=response["status"])
        except IntegrityError:
            return Response(
                {"error": "Username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["GET"])
    def fetch_user_repo_details(self, req: Request):
        try:
            username = req.query_params.get("username")
            if not username:
                return ResponseBody.build(
                    {"error": "Username is required."}, status=400
                )
            referenceID = AuthCrud.Fetch_User_Repo_Reference(username=username)
            return Response({"referenceID": referenceID}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=["DELETE"])
    def delete_user(self, req: Request):
        response = AuthCrud.delete_user(req.data)
        return Response(response["response"], status=response["status"])
