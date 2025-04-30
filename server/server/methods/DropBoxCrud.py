from importlib.metadata import files

import os

import traceback
import zipfile

from django.forms import model_to_dict
from dotenv import load_dotenv
import dropbox
import dropbox.exceptions

from server.configs.dropbox.config import get_dropbox_service
from server.methods.RepoDatabaseHandler import Insert_Repo_Structure
from server.methods.database.RepositoryDatabaseService import RepoDbService
from server.models import RepositoryModel, UserModel, UserStorageReference
from server.serializers.RepositorySerializer import RepositorySerializer
from server.utils.ResponseBody import ResponseBody
from server.utils.ZipWriters import Create_Zip_Object
from django.core.files.uploadedfile import InMemoryUploadedFile

load_dotenv()


class DropBoxService:
    working_dir = os.getenv("WORKING_DIR")

    # This is triggered when user register their account
    @staticmethod
    def Init_User_Storage(storage_ref: str, username: str) -> dict:
        try:
            dbx = get_dropbox_service()
            working_dir = DropBoxService.working_dir
            user_folder_ref = f"{working_dir}/{storage_ref}"
            dbx.files_create_folder_v2(user_folder_ref)
            readme_path = DropBoxService.Create_README_file(
                folder_path=user_folder_ref, username=username
            )

            return {
                "success": True,
                "folder_ref": user_folder_ref,
                "readme_ref": readme_path,
            }
        except dropbox.exceptions.ApiError as e:
            if e.error.is_path() and e.error.get_path().is_conflict():
                return {"success": False, "message": "Folder already exists"}

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
    def Init_Repo_Dir(
        repo_name: str, user_storage_ref: str, username: str, repo_des: str
    ) -> dict:
        # checking users storage reference
        is_storageRef_exists = RepoDbService.is_user_storage_ref_valid(user_storage_ref)
        if not is_storageRef_exists:
            return {"response": {"error": "storage reference not found"}, "status": 404}
        try:
            dbx = get_dropbox_service()
            folder_path = f"{os.getenv("WORKING_DIR")}/{user_storage_ref}/{repo_name}"
            response = dbx.files_create_folder_v2(folder_path)

            repo_path = response.metadata.path_lower
            newRepo = RepositoryModel.objects.create(
                owner=username, repoName=repo_name, repo_path=repo_path, des=repo_des
            )
            serializedRepo = RepositorySerializer(newRepo).data
            return ResponseBody.build({"newRepo": serializedRepo}, status=201)

        except dropbox.exceptions.ApiError as e:
            err_message = traceback.format_exc(e)
            print(err_message)
            # Handle the case where the folder already exists
            if e.error.is_path() and e.error.get_path().is_conflict():
                print("Error")
                return ResponseBody.build(
                    {"message": f"Folder '{folder_path}' already exists."}, status=400
                )
            else:
                return ResponseBody.build({"message": str(e)}, status=500)

    @staticmethod
    def Insert_Repo(zip_stream: InMemoryUploadedFile, repo_path: str):
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
            print(e)
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
            return ResponseBody.build(
                {"message": "Repository deleted successfully"}, 200
            )

        except dropbox.exceptions.ApiError as e:
            return ResponseBody.build(
                {"error": f"Cloud storage Api error {str(e)}"}, status=500
            )

    @staticmethod
    def Update_Repo_Name(repo_path: str, new_repo_name: str):
        try:
            dbx = get_dropbox_service()

            # Fetch the parent folder path
            parent_folder_path = os.path.dirname(repo_path)
            new_path = f"{parent_folder_path}/{new_repo_name}"

            # Rename the folder in Dropbox
            response = dbx.files_move_v2(repo_path, new_path)
            repo_path = response.metadata.path_lower

            return repo_path

        except dropbox.exceptions.ApiError as e:
            print("Update error ", e)
            return ""

    @staticmethod
    def Create_README_file(folder_path: str, username: str):
        dbx = get_dropbox_service()
        readme_content = f"${username}"
        readme_bytes = readme_content.encode("utf-8")
        readme_path = f"{folder_path}/{username}.md"
        dbx.files_upload(
            readme_bytes, readme_path, mode=dropbox.files.WriteMode("overwrite")
        )
        return readme_path
