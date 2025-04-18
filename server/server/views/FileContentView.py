from rest_framework.views import APIView

from rest_framework.request import Request
from rest_framework.response import Response

from server.methods.ZipMethods import get_file_content

from rest_framework.permissions import IsAuthenticated, AllowAny


class FileContentView(APIView):
    permission_classes = [AllowAny]

    def get(self, req: Request):
        file_path = req.query_params.get("file_path")
        print("FILE PATH", file_path)
        if not file_path:
            return Response({"message": "file path is required"}, status=400)
        get_file_content_response = get_file_content(file_path)
        return Response(
            get_file_content_response["response"],
            status=get_file_content_response["status"],
        )
