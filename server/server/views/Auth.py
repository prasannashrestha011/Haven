from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action


from server.methods.AuthCrud import AuthCrud
from django.db import IntegrityError
from rest_framework import status


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

    @action(detail=False, methods=["DELETE"])
    def delete_user(self, req: Request):
        response = AuthCrud.delete_user(req.data)
        return Response(response["response"], status=response["status"])
