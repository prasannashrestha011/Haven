from io import BytesIO
import dropbox
import zipfile
import concurrent.futures
import threading
from django.core.files.uploadedfile import InMemoryUploadedFile
import time

thread_local = threading.local()


def Create_Zip_Object(
    dbx: dropbox.Dropbox, repo_zip: InMemoryUploadedFile, folder_path: str
):
    start_time = time.time()
    access_token = dbx._oauth2_access_token
    zip_bytes = repo_zip.read()

    def init_dbx():
        # Initialize a Dropbox client per thread
        thread_local.dbx = dropbox.Dropbox(access_token)

    def _upload_worker(content: bytes, path: str):
        try:
            # Use the thread-specific client
            thread_local.dbx.files_upload(content, path)
            print(f"Uploaded {path}")
        except Exception as e:
            print(f"Error uploading {path}: {e}")
            raise  # Re-raise to handle in the main loop

    with zipfile.ZipFile(BytesIO(zip_bytes)) as zip_file:
        # Process files and submit tasks concurrently
        with concurrent.futures.ThreadPoolExecutor(
            max_workers=40,  # Increased from 10 to 20
            initializer=init_dbx,  # Initialize client once per thread
        ) as executor:
            futures = []
            for file_info in zip_file.infolist():
                if not file_info.is_dir():
                    with zip_file.open(file_info) as file:
                        content = file.read()
                        dbx_path = f"{folder_path}/{file_info.filename}"
                        # Submit task immediately after reading the file
                        future = executor.submit(_upload_worker, content, dbx_path)
                        futures.append(future)

            # Handle exceptions as they occur
            for future in concurrent.futures.as_completed(futures):
                try:
                    future.result()
                except Exception as e:
                    print(f"Upload failed: {e}")
    duration = time.time() - start_time  # End timer
    print(f"Upload completed in {duration:.2f} seconds.")
