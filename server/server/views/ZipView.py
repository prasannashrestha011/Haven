import os
import shutil
import tempfile
import uuid
import zipfile
from django.conf import settings
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from server.methods.ZipMethods import fetch_repo, insert_repo_details
from server.models import FileModel, RepositoryModel,DirectoryModel


class ZipView(APIView):
    permission_classes = [AllowAny]
    def get(self, req: Request):
        repo_name = req.query_params.get('repo')
        user = req.query_params.get('user')

        if not repo_name or not user:
            return Response({"message": "Repository name and user are required"}, status=400)

        response_data=fetch_repo(user=user,repo_name=repo_name)

        return Response(response_data, status=200)

    def post(self, req: Request):
        zip_file = req.FILES.get('zip')
        user = req.query_params.get('user')
        repo_name = req.query_params.get('repo')

        if not zip_file or not user:
            return Response({"message": "No zip or username file found"}, status=400)

        response_data=insert_repo_details(zip_file=zip_file,
                                         user=user,
                                         repo_name=repo_name)
        return Response({"message":response_data["message"]},status=response_data["status"])