from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response

from server.methods.AuthCrud import AuthCrud
from server.methods.ZipMethods import get_file_content, update_readme_file

from server.serializers.ReadMeSerializer import ReadeMeSerializer
from server.serializers.UserSerializer import UserSerializer


class ProfileView(APIView):
    # for fetching read me file
    def get(self, req: Request):
        username = req.query_params.get("username")
        if not username:
            return Response({"error": "User name not provided"}, status=400)
        fetchedUser = AuthCrud.Fetch_User_Details(username=username)
        if not fetchedUser:
            return Response({"error": "User not found"}, status=404)
        print(fetchedUser)
        fetchedReadMe = get_file_content(fetchedUser["readme_ref"])
        print(fetchedReadMe)

        serialized_readme = ReadeMeSerializer(data=fetchedReadMe["response"]["message"])
        if not serialized_readme.is_valid():
            return Response({"error": "invalid readme file"}, status=400)
        responseBody = {"user": fetchedUser, "readme": serialized_readme.data}

        return Response(responseBody, status=200)

    def put(self, req: Request):
        readme_ref = req.query_params.get("readme_ref")
        if not readme_ref:
            return Response(
                {"error": "Read me reference link not provided"}, status=400
            )
        serialized_data = ReadeMeSerializer(data=req.data)
        if not serialized_data.is_valid():
            return Response({"error": serialized_data.errors}, status=400)
        validated_data = serialized_data.validated_data
        file_content = validated_data.get("content")
        result = update_readme_file(readme_ref, file_content)
        return Response(result["response"], status=result["status"])
