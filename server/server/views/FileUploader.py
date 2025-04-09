from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from server.configs.google_drive.methods import upload_to_drive
from server.serializers.FileSerializer import FileSerializer
from rest_framework.permissions import IsAuthenticated


class FileParserView(APIView):
    permission_classes = [AllowAny]

    def get(self, req: Request):
        user = req.query_params.get("user")
        return Response({"name": user})

    def post(self, req: Request):
        body = FileSerializer(data=req.data)
        if not body.is_valid():
            return Response({"message": "failed", "id": "uploaded_file_id"})

        print(body)

        return Response({"message": "success", "id": "uploaded_file_id"})
