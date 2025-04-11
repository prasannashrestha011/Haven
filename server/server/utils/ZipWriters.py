from io import BytesIO
import dropbox
import zipfile


def Create_Zip_Object(dbx: dropbox, repo_zip: zipfile.ZipFile, folder_path: str):

    file_content = repo_zip.read()

    with zipfile.ZipFile(BytesIO(file_content)) as zip_file:
        for file_info in zip_file.infolist():
            if not file_info.is_dir():
                with zip_file.open(file_info) as file:
                    dbx_path = f"{folder_path}/{file_info.filename}"
                    dbx.files_upload(file.read(), dbx_path)
