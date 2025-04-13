from django.conf import settings
from django.db import transaction

from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from server.methods import DropBoxCrud
from server.methods.DropBoxCrud import DropBoxService
from server.methods.ZipMethods import fetch_repo, insert_repo_details


class ZipView(ViewSet):
    permission_classes = [AllowAny]

    def get_repo_details(self, req: Request):
        repo_name = req.query_params.get("repo")
        user = req.query_params.get("user")

        if not repo_name or not user:
            return Response(
                {"message": "Repository name and user are required"}, status=400
            )

        response_data = fetch_repo(user=user, repo_name=repo_name)

        return Response(response_data, status=200)

    def init_repo(self, req: Request):
        repo_name = req.query_params.get("repo")
        storage_ref = req.query_params.get("storage_ref")
        username = req.query_params.get("username")
        if not repo_name or not storage_ref:
            return Response(
                {"error": "repo name or userID is not provided"}, status=400
            )

        response = DropBoxService.Init_Repo_Dir(
            repo_name=repo_name, user_storage_ref=storage_ref, username=username
        )
        return Response(response, status=201)

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
