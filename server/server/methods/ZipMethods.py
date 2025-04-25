import os
import shutil
import tempfile
from typing import Optional
import uuid
import zipfile
from django.conf import settings
from django.db import transaction
from django.forms import model_to_dict
import redis
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from server.configs.dropbox.config import get_dropbox_service
from server.configs.redis.redis import cache_file_content, get_redis_client
from server.models import FileModel, RepositoryModel, DirectoryModel
from server.serializers.RepositorySerializer import RepositorySerializer
from server.utils.ResponseBody import ResponseBody


def fetch_repo_list(user: str) -> dict:
    try:
        repos = RepositoryModel.objects.filter(owner=user)
    except RepositoryModel.DoesNotExist:
        return {"message": "No repositories found", "status": 404}

    repo_list = []
    for repo in repos:
        repo_data = RepositorySerializer(repo).data
        repo_list.append(repo_data)

    return {"repos": repo_list, "status": 200}


def fetch_repo_metadata(repoID: str) -> dict:
    if not repoID:
        return {"message": "Repository ID is required", "status": 400}

    try:
        repo = RepositoryModel.objects.get(repoID=repoID)
    except RepositoryModel.DoesNotExist:
        return {"message": "Repository not found", "status": 404}

    repo_data = RepositorySerializer(repo).data
    return repo_data


def fetch_repo(user: str, repo_name: str) -> dict:
    try:
        repo = RepositoryModel.objects.get(repoName=repo_name, owner=user)
    except RepositoryModel.DoesNotExist:
        return {"message": "Repository not found", "status": 404}

    # Get all directories and files associated with the repository
    directories = DirectoryModel.objects.filter(repo=repo).select_related("parent_dir")
    files = FileModel.objects.filter(repo=repo).select_related("directory")

    # Initialize data structures
    dir_map = {}  # Maps directory IDs to directory data
    root_dirs = []  # Top-level directories (no parent)
    root_files = []  # Files in the root directory (no parent directory)

    # First pass: create all directory entries
    for directory in directories:
        dir_data = {
            "dirID": directory.dirID,
            "dirName": directory.dirName,
            "files": [],
            "subdirectories": [],
        }
        dir_map[directory.dirID] = dir_data

        if directory.parent_dir is None:
            root_dirs.append(dir_data)

    # Second pass: build the hierarchy
    for directory in directories:
        if directory.parent_dir and directory.parent_dir.dirID in dir_map:
            parent_data = dir_map[directory.parent_dir.dirID]
            parent_data["subdirectories"].append(dir_map[directory.dirID])

    # Third pass: organize files
    for file in files:
        file_data = {
            "fileID": file.fileID,
            "fileName": file.fileName,
            "filePath": file.filePath if hasattr(file, "filePath") else None,
        }
        if file.directory:
            if file.directory.dirID in dir_map:
                dir_map[file.directory.dirID]["files"].append(file_data)
        else:
            root_files.append(file_data)

    # Prepare the final response
    response_data = {
        "repoID": repo.repoID,
        "repoName": repo.repoName,
        "owner": repo.owner.username if hasattr(repo.owner, "username") else repo.owner,
        "structure": {"rootFiles": root_files, "directories": root_dirs},
        "status": 200,
    }

    return response_data


def insert_repo_details(zip_file: zipfile.ZipFile, user: str, repo_name: str) -> dict:
    if not zip_file or not user:
        return Response({"message": "No zip or username file found"}, status=400)

    # Create temporary directory and extract zip
    temp_dir = tempfile.mkdtemp()
    with zipfile.ZipFile(zip_file.file, "r") as zip_ref:
        zip_ref.extractall(temp_dir)

    # Create repository
    repo = RepositoryModel.objects.create(repoName=repo_name, owner=user)

    # Dictionary to track created directories and their models
    created_dirs = {}
    for root, dirs, files in os.walk(temp_dir):
        for file in files:
            path = os.path.join(root, file)  # full path
            rel_file_path = os.path.relpath(
                path, start=temp_dir
            )  # relative part to temp dir
            parent_dir = os.path.dirname(rel_file_path)  # parent dir of current file

            path_part = (
                parent_dir.split(os.sep) if parent_dir else []
            )  # dirs and subdirs
            current_path = ""
            parent_dir_model = None

            for part in path_part:
                current_path = os.path.join(current_path, part)
                if current_path not in created_dirs:
                    parent_dir_model = DirectoryModel.objects.create(
                        dirName=part, repo=repo, parent_dir=parent_dir_model
                    )
                    created_dirs[current_path] = parent_dir_model
                else:
                    parent_dir_model = created_dirs[current_path]

            FileModel.objects.create(
                fileName=file, directory=parent_dir_model, repo=repo
            )

    return {"message": "Repo created successfully", "status": 201}


def get_file_content(file_path: str) -> ResponseBody:

    #
    redis_client = get_redis_client()
    file_name = os.path.basename(file_path)
    # checking if file is already cached
    cached_content: Optional[bytes] = redis_client.get(file_name)
    if cached_content:
        content = cached_content.decode("utf-8")
        print("Getting cached file....")
        return ResponseBody.build(
            {"message": {"file_name": file_name, "content": content}}, status=200
        )
    #
    try:
        dbx = get_dropbox_service()
        metadata, res = dbx.files_download(file_path)
        if res.status_code != 200:
            return ResponseBody.build(
                {"error": "Failed to download file"}, status=res.status_code
            )
        file_name = metadata.name
        content = res.content.decode("utf-8")
        print("Caching file content on redis....")
        cache_file_content(r=redis_client, file_name=file_name, file_content=content)
        return ResponseBody.build(
            {"message": {"file_name": file_name, "content": content}}, status=200
        )
    except Exception as e:
        print(f"Error: {e}")
        return ResponseBody.build({"error": str(e)}, status=500)


# if repo name is changed then only we change the repo path
def updated_repo_details(
    repoID: str,
    newRepoName: Optional[str],
    newRepoDes: Optional[str],
    newRepoPath: Optional[str],
):
    try:
        repo = RepositoryModel.objects.get(repoID=repoID)
    except RepositoryModel.DoesNotExist:
        return {"status": "error", "message": "Repository not found"}

    if newRepoName:
        repo.repoName = newRepoName
        repo.repo_path = newRepoPath
    if newRepoDes:
        repo.des = newRepoDes

    repo.save()
    serializedRepo = RepositorySerializer(repo)
    return serializedRepo.data
