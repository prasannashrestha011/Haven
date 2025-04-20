from importlib.metadata import files
from io import BytesIO
import os

import zipfile

from django.forms import model_to_dict
from dotenv import load_dotenv
import dropbox
import dropbox.exceptions

from server.configs.dropbox.config import get_dropbox_service
from server.methods.RepoDatabaseHandler import Insert_Repo_Structure
from server.methods.database.RepositoryDatabaseService import RepoDbService
from server.models import RepositoryModel, UserModel, UserStorageReference
from server.utils.ResponseBody import ResponseBody
from server.utils.ZipWriters import Create_Zip_Object

load_dotenv()


class DropBoxService:
    working_dir = os.getenv("WORKING_DIR")

    # This is triggered when user register their account
    @staticmethod
    def Init_User_Storage(storage_ref: str) -> dict:
        try:
            dbx = get_dropbox_service()
            working_dir = DropBoxService.working_dir
            user_folder = f"{working_dir}/{storage_ref}"
            created_response = dbx.files_create_folder_v2(user_folder)
            return {"status": "success", "message": "Inited user in the storage"}
        except dropbox.exceptions.ApiError as e:
            if e.error.is_path() and e.error.get_path().is_conflict():

                return ResponseBody.build(
                    {"message": f"Folder '{user_folder}' already exists."}, status=400
                )

    # Triggers when account is deleted
    @staticmethod
    def Delete_User_Storage(userID: str):
        try:
            # Fetch the user based on userID
            user = UserModel.objects.get(userId=userID)

            # Fetch associated storage reference
            storage_reference = UserStorageReference.objects.get(user=user)

            dbx = get_dropbox_service()
            folder_path = f"{DropBoxService.working_dir}/{storage_reference.storageID}"

            dbx.files_delete_v2(folder_path)
            # deleting the storage reference in the database
            storage_reference.delete()

            return {"message": "User storage deleted successfully", "status": 200}

        except UserModel.DoesNotExist:
            return {"error": "User not found", "status": 404}

        except UserStorageReference.DoesNotExist:
            return ResponseBody.build({"User storage not found": str(e)}, status=404)

        except Exception as e:
            return ResponseBody.build({"Internal server error": str(e)}, status=500)

    @staticmethod
    def Delete_All_From_Working_Dir() -> dict:
        try:
            dbx = get_dropbox_service()

            deleted_items = []

            # List all items inside the working directory
            result = dbx.files_list_folder(DropBoxService.working_dir)

            for entry in result.entries:
                dbx.files_delete_v2(entry.path_lower)
                deleted_items.append(entry.name)

            # Keep checking if there are more items (pagination)
            while result.has_more:
                result = dbx.files_list_folder_continue(result.cursor)
                for entry in result.entries:
                    dbx.files_delete_v2(entry.path_lower)
                    deleted_items.append(entry.name)

            return ResponseBody.build({"message": deleted_items}, status=200)

        except dropbox.exceptions.ApiError as e:
            return ResponseBody.build({"Cloud storage Api error": str(e)}, status=400)
        except Exception as e:
            return ResponseBody.build({"error": str(e)}, status=500)

    # methods related to repository

    @staticmethod
    def Init_Repo_Dir(repo_name: str, user_storage_ref: str, username: str) -> dict:
        is_storageRef_exists = RepoDbService.is_user_storage_ref_valid(user_storage_ref)
        if not is_storageRef_exists:
            return {"response": {"error": "storage reference not found"}, "status": 404}
        try:
            dbx = get_dropbox_service()
            folder_path = f"{os.getenv("WORKING_DIR")}/{user_storage_ref}/{repo_name}"
            response = dbx.files_create_folder_v2(folder_path)

            repo_path = response.metadata.path_lower
            newRepo = RepositoryModel.objects.create(
                owner=username, name=repo_name, repo_path=repo_path
            )
            json_response = {
                "repoID": str(newRepo.repoID),
                "owner": newRepo.owner,
                "repoName": newRepo.name,
                "repo_path": newRepo.repo_path,
                "created_at": newRepo.created_at.isoformat(),
                "updated_at": newRepo.updated_at.isoformat(),
            }
            return ResponseBody.build({"newRepo": json_response}, status=201)

        except dropbox.exceptions.ApiError as e:
            # Handle the case where the folder already exists
            if e.error.is_path() and e.error.get_path().is_conflict():
                return ResponseBody.build(
                    {"message": f"Folder '{folder_path}' already exists."}, status=400
                )
            else:
                return ResponseBody.build({"message": str(e)}, status=500)

    @staticmethod
    def Insert_Repo(zip_stream: zipfile.ZipFile, repo_path: str):
        try:
            dbx = get_dropbox_service()
            is_repo_exists = RepoDbService.is_repo_path_valid(repo_path)
            if not is_repo_exists:
                return ResponseBody.build({"error": "Repository not found"}, status=404)

            Create_Zip_Object(
                dbx=dbx,
                repo_zip=zip_stream,
                folder_path=repo_path,
            )

            response = Insert_Repo_Structure(zip_stream=zip_stream, repo_path=repo_path)

            return ResponseBody.build(
                {"message": response["response"]["message"]}, status=response["status"]
            )

        except dropbox.exceptions.ApiError as e:
            print(e)
            return ResponseBody.build({"Cloud storage Api error": str(e)}, status=400)
        except Exception as e:
            return ResponseBody.build({"error": str(e)}, status=500)

    @staticmethod
    def Delete_Repo(repo_path):
        try:
            dbx = get_dropbox_service()

            folder_list = dbx.files_list_folder(repo_path)

            # deleting from dropbox
            dbx.files_delete_v2(repo_path)
            # deleting from database through (unique)repo_path
            is_deleted = RepoDbService.delete_repo(repo_path=repo_path)
            if not is_deleted:
                return ResponseBody.build({"error": "Repository not found"}, status=404)
            return ResponseBody.build({"message": "Repository deleted successfully"}, 200)

        except dropbox.exceptions.ApiError as e:
            return ResponseBody.build(
                {"error": f"Cloud storage Api error {str(e)}"}, status=500
            )
