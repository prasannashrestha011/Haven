import os
import shutil
from django.db import transaction
import tempfile
import zipfile


from server.methods.database.RepositoryDatabaseService import RepoDbService
from server.models import DirectoryModel, FileModel


def Insert_Repo_Structure(zip_stream: zipfile.ZipFile, repo_path: str) -> dict:
    repo = RepoDbService.fetch_repo(repo_path)
    if not repo:
        return {"response": {"error": "Repository not found"}, "status": 404}

    temp_dir = tempfile.mkdtemp()
    with zipfile.ZipFile(zip_stream, "r") as zip_ref:
        zip_ref.extractall(temp_dir)
    # Dictionary to track created directories and their models
    created_dirs = {}

    try:
        with transaction.atomic():
            for root, dirs, files in os.walk(temp_dir):
                for file in files:
                    path = os.path.join(root, file)
                    rel_file_path = os.path.relpath(path=path, start=temp_dir)
                    parent_dir_path = os.path.dirname(rel_file_path)
                    filename = os.path.basename(rel_file_path)

                    path_parts = (
                        parent_dir_path.split(os.sep) if parent_dir_path else []
                    )
                    current_path = ""
                    parent_dir_model = None

                    for part in path_parts:
                        current_path = (
                            os.path.join(current_path, part) if current_path else part
                        )

                        # Check if directory exists in the created_dirs dictionary
                        if current_path not in created_dirs:
                            # Create the directory if not found
                            parent_dir_model = DirectoryModel.objects.create(
                                dirName=part,
                                repo=repo,
                                parent_dir=parent_dir_model,  # Link to parent if any
                            )

                            created_dirs[current_path] = parent_dir_model
                        else:
                            parent_dir_model = created_dirs[
                                current_path
                            ]  # Fetch from dict
                    FileModel.objects.create(
                        fileName=filename, directory=parent_dir_model, repo=repo
                    )
        shutil.rmtree(temp_dir)
        return {
            "response": {"message": "Files and Folders added to the respository"},
            "status": 200,
        }
    except Exception as e:
        print("Repo strucuture insertion error-> ", e)
        return {"response": {"error": "Insertion Error in repository"}, "status": "500"}
