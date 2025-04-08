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

from server.models import FileModel, RepositoryModel,DirectoryModel

def fetch_repo(user:str,repo_name:str)->dict:
        try:
            repo = RepositoryModel.objects.get(name=repo_name, owner=user)
        except RepositoryModel.DoesNotExist:
            return {"message": "Repository not found","status":404}

        # Get directories and files associated with the repository
        directories = DirectoryModel.objects.filter(repo=repo)
        files = FileModel.objects.filter(repo=repo)

        # Prepare the data to return (e.g., list of directories and files)
        directory_data = [
            {
                "dirID": directory.dirID,
                "dirName": directory.dirName,
                "parent_dir": directory.parent_dir.dirName if directory.parent_dir else None
            }
            for directory in directories
        ]
        file_data = [
            {
                "fileID": file.fileID,
                "fileName": file.fileName,
                "directory": file.directory.dirName if file.directory else None
            }
            for file in files
        ]

        # Combine the results into a response payload
        response_data = {
            "repoID": repo.repoID,
            "repoName": repo.name,
            "owner": repo.owner,
            "directories": directory_data,
            "files": file_data
        }
        return response_data

def insert_repo_details(zip_file:zipfile.ZipFile,user:str,repo_name:str)->dict:
        if not zip_file or not user:
            return Response({"message": "No zip or username file found"}, status=400)

        # Create temporary directory and extract zip
        temp_dir = tempfile.mkdtemp()
        with zipfile.ZipFile(zip_file.file, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)

        # Create repository
        repo = RepositoryModel.objects.create(name=repo_name, owner=user)

        # Dictionary to track created directories and their models
        created_dirs = {}
        for root, dirs, files in os.walk(temp_dir):
           for file in files:
               path=os.path.join(root,file) #full path 
               rel_file_path=os.path.relpath(path,start=temp_dir) #relative part to temp dir
               parent_dir=os.path.dirname(rel_file_path) # parent dir of current file
               
               path_part=parent_dir.split(os.sep) if parent_dir else [] # dirs and subdirs 
               current_path=""
               parent_dir_model=None

               for part in path_part:
                   current_path=os.path.join(current_path,part)
                   if current_path not in created_dirs:
                       parent_dir_model=DirectoryModel.objects.create(
                           dirName=part,
                           repo=repo,
                           parent_dir=parent_dir_model
                       )
                       created_dirs[current_path]=parent_dir_model
                   else:
                        parent_dir_model=created_dirs[current_path]
               
               FileModel.objects.create(
                    fileName=file,
                    directory=parent_dir_model,
                    repo=repo
                )

        return {"message":"Repo created successfully","status":201}



