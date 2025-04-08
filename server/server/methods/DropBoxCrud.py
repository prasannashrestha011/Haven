
from importlib.metadata import files
from io import BytesIO
import os
import zipfile

from dotenv import load_dotenv
import dropbox
import dropbox.exceptions

from server.configs.dropbox.config import get_dropbox_service
load_dotenv()

class DropBoxService:
  @staticmethod
  def Delete_All_From_Working_Dir() -> dict:
        try:
            dbx = get_dropbox_service()
            working_dir = os.getenv("WORKING_DIR")
            deleted_items = []

            # List all items inside the working directory
            result = dbx.files_list_folder(working_dir)

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
  @staticmethod
  def Init_Repo_Dir(repo_name:str)->dict:
    try:
        dbx=get_dropbox_service()
        folder_path=f"{os.getenv("WORKING_DIR")}/{repo_name}"
        response=dbx.files_create_folder_v2(folder_path)
        print(response)
        return {"message":response.metadata.path_lower}
    except dropbox.exceptions.ApiError as e:
            # Handle the case where the folder already exists
        if e.error.is_path() and e.error.get_path().is_conflict():
            return {"status": "exists", "message": f"Folder '{folder_path}' already exists."}
        else:
            return {"status": "error", "message": str(e)}

  @staticmethod
  def Upload_Dir(zip_stream: zipfile.ZipFile, repo_name: str):
        try:
            dbx = get_dropbox_service()
            working_dir = os.getenv('WORKING_DIR')
            folder_path = f"{working_dir}/{repo_name}"
            
            # Create the target folder in Dropbox
            dbx.files_create_folder_v2(folder_path)
            
            # Read the uploaded file content into memory
            file_content = zip_stream.read()
            
            # Create a ZipFile object from the uploaded content
            with zipfile.ZipFile(BytesIO(file_content)) as zip_file:
                for file_info in zip_file.infolist():
                    if not file_info.is_dir():
                        with zip_file.open(file_info) as file:
                            dbx_path=f"{folder_path}/{file_info.filename}"
                            dbx.files_upload(file.read(),dbx_path)
            
            return {"status": "success", "message": "Files uploaded successfully"}
        
        except dropbox.exceptions.ApiError as e:
            return {"status": "error", "message": str(e)}
        except Exception as e:
            return {"status": "error", "message": str(e)}
