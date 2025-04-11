from email import message
from importlib.metadata import files
from io import BytesIO
import os

import zipfile

from dotenv import load_dotenv
import dropbox
import dropbox.exceptions

from server.configs.dropbox.config import get_dropbox_service
from server.methods.RepoDatabaseHandler import Insert_Repo_Structure
from server.methods.database.RepositoryDatabaseService import RepoDbService
from server.models import RepositoryModel, UserModel, UserStorageReference

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
                return {
                    "status": "exists",
                    "message": f"Folder '{user_folder}' already exists.",
                }

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
            return {"error": "User storage not found", "status": 404}

        except Exception as e:
            return {"error": str(e), "status": 500}

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

            return {"status": "success", "deleted": deleted_items}

        except dropbox.exceptions.ApiError as e:
            return {"status": "error", "message": str(e)}
        except Exception as e:
            return {"status": "error", "message": str(e)}

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
            print("Response->", response)
            repo_path = response.metadata.path_lower

            RepositoryModel.objects.create(
                owner=username, name=repo_name, repo_path=repo_path
            )
            print(response)
            return {
                "response": {"message": response.metadata.path_lower},
                "status": 201,
            }

        except dropbox.exceptions.ApiError as e:
            # Handle the case where the folder already exists
            if e.error.is_path() and e.error.get_path().is_conflict():

                return {
                    "status": "exists",
                    "response": {
                        "message": f"Folder '{folder_path}' already exists.",
                    },
                }
            else:
                return {"status": "error", "response": {"message": str(e)}}

    @staticmethod
    def Insert_Repo(zip_stream: zipfile.ZipFile, repo_path: str):
        try:
            dbx = get_dropbox_service()
            working_dir = os.getenv("WORKING_DIR")
            folder_path = f"{working_dir}/{repo_path}"

            # Read the uploaded file content into memory
            file_content = zip_stream.read()

            # Create a ZipFile object from the uploaded content
            with zipfile.ZipFile(BytesIO(file_content)) as zip_file:
                for file_info in zip_file.infolist():
                    if not file_info.is_dir():
                        with zip_file.open(file_info) as file:
                            dbx_path = f"{folder_path}/{file_info.filename}"
                            dbx.files_upload(file.read(), dbx_path)

            response = Insert_Repo_Structure(
                zip_stream=zip_stream, repo_path=folder_path
            )

            return {
                "status": response["status"],
                "response": response["response"],
            }

        except dropbox.exceptions.ApiError as e:
            print(e)
            return {"status": 400, "response": {"message": str(e)}}
        except Exception as e:
            return {"status": 500, "response": {"error": str(e)}}
