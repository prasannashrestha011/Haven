import traceback
from django.conf import settings
from django.db import transaction

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from server.methods import DropBoxCrud
from server.methods.DropBoxCrud import DropBoxService
from server.methods.Repository.CRUD import handle_repo_update
from server.methods.UserMethod import UserMethods
from server.methods.ZipMethods import (
    fetch_repo,
    fetch_repo_list,
    fetch_repo_metadata,
    insert_repo_details,
    updated_repo_details,
)
from server.serializers.NewRepoSerializer import NewRepoSerializer
from server.serializers.UpdateRepoSerializer import UpdateRepoSerializer


class ZipView(ViewSet):
    permission_classes = [AllowAny]

    def get_repo_list(self, req: Request):
        username = req.query_params.get("username")
        if not username:
            return Response({"message": "username not provided"}, status=400)
        response = fetch_repo_list(user=username)
        return Response(response["repos"], status=response["status"])

    def get_repo_meta_data(self, req: Request):
        repo_name = req.query_params.get("repo")
        user = req.query_params.get("user")
        if not repo_name or not user:
            return Response(
                {"message": "Repository name and user are required"}, status=400
            )

    def get_repo_structure(self, req: Request):
        repo_name = req.query_params.get("repo")
        user = req.query_params.get("user")

        if not repo_name or not user:
            return Response(
                {"message": "Repository name and user are required"}, status=400
            )

        response_data = fetch_repo(user=user, repo_name=repo_name)

        return Response(response_data, status=200)

    def init_repo(self, req: Request):
        serializer = NewRepoSerializer(data=req.data)
        if not serializer.is_valid():
            return Response(serializer.error_messages, status=400)

        repo_name = serializer.validated_data.get("repo_name")
        username = serializer.validated_data.get("username")
        repo_des = serializer.validated_data.get("repo_des", "")

        if not repo_name or not username:
            print("Not enought input")
            return Response(
                {"error": "repo name or username is not provided"}, status=400
            )
        storageID = UserMethods.fetch_storageID(username=username)

        response = DropBoxService.Init_Repo_Dir(
            repo_name=repo_name,
            user_storage_ref=storageID,
            username=username,
            repo_des=repo_des,
        )
        return Response(response["response"], status=201)

    def insert_repo(self, req: Request):

        repo_path = req.query_params.get("repo_path")
        repo_zip = req.FILES.get("repo_zip")
        print(repo_path)
        print(repo_zip)
        if not repo_path or not repo_zip:
            return Response(
                {"message": "Repo path or zip file not provided"}, status=400
            )

        response = DropBoxService.Insert_Repo(zip_stream=repo_zip, repo_path=repo_path)
        return Response(response["response"], status=response["status"])

    def delete_all_repos(self, req: Request):
        response = DropBoxService.Delete_All_From_Working_Dir()
        return Response(response, status=200)

    def commit_content_on_repo(self, req: Request):
        zip_file = req.FILES.get("zip")
        user = req.query_params.get("user")
        repo_name = req.query_params.get("repo")

        if not zip_file or not user:
            return Response({"message": "No zip or username file found"}, status=400)
        zip_id = DropBoxService.Upload_Dir(zip_stream=zip_file, repo_name=repo_name)
        response_data = insert_repo_details(
            zip_file=zip_file, user=user, repo_name=repo_name
        )
        return Response(
            {"message": response_data["message"], "zip_id": zip_id},
            status=response_data["status"],
        )

    def delete_repo(self, req: Request):
        repo_path = req.query_params.get("repo_path")
        if not repo_path:
            return Response({"message": "Repo path not provided"}, status=400)
        response = DropBoxService.Delete_Repo(repo_path=repo_path)
        return Response(response["response"], status=response["status"])

    def update_repo_details(self, req: Request):
        serializer = UpdateRepoSerializer(data=req.data)
        try:
            if serializer.is_valid():
                validated_data = serializer.validated_data
                repoID = validated_data.get("repoID")
                newRepoName = validated_data.get("newRepoName")
                newRepoDes = validated_data.get("newRepoDes", "")
                print(newRepoName)
                print(newRepoDes)
                responseBody = handle_repo_update(
                    repoID=repoID, newRepoName=newRepoName, newRepoDes=newRepoDes
                )

                return Response(responseBody["response"], status=200)
            else:
                print(serializer.error_messages)
                return Response({"error": serializer.error_messages}, status=400)
        except Exception as e:
            err_message = traceback.format_exc()
            print("Error ", err_message)
            return Response({"error": "Unknow error", "details": str(e)}, status=500)
