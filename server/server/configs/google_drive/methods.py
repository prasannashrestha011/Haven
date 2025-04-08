import zipfile
from googleapiclient.discovery import Resource
from io import BytesIO

from googleapiclient.http import MediaIoBaseUpload
from django.core.files.uploadedfile import UploadedFile
from asgiref.sync import sync_to_async
from server.configs.google_drive.drive_service import get_drive_service
folder_id = "1dqjBHDHoxRtfCZ-QQ3QBpB_poWpnhC4a" 

def create_user_folder(user_id:str)->str:
    drive_service=get_drive_service()
    folder_metadata = {
        'name': f"user_{user_id}_folder",  
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [folder_id]
    }
    created_folder_id=drive_service.files().create(body=folder_metadata,fields='id').execute()
    return created_folder_id.get('id')


def upload_to_drive(file:UploadedFile)->str:
    #Drive resource for uploading the file
    drive_service:Resource=get_drive_service()
    #This is a folder id obtained through shared link where All the uploaded files will be saved in the 
    # personal drive.
   

    file_metadata={
        'name':file.name,
        'parents':[folder_id],
        'mimeType':'application/vnd.google-apps.document'
    }
    file_content=file.read()
    #preparing a media body for drive upload
    media=MediaIoBaseUpload(
        BytesIO(file_content),
        mimetype='text/plain',
        resumable=True #if any network interuptions happens ,its going to resume automatically on restore
    )
    #finally uploading the file throught drive service
    uploaded_file=drive_service.files().create(body=file_metadata,
                                              media_body=media,
                                              fields='id').execute()
    return uploaded_file.get('id')

def upload_zip_to_drive(zip_stream: BytesIO, name: str) -> str:
    if zip_stream is None:
        raise ValueError("zip_stream cannot be None")
    
    drive_service: Resource = get_drive_service()

    # Rewind the stream before reading
    zip_stream.seek(0)

    file_metadata = {
        'name': name,
        'parents': [folder_id],
    }

    media = MediaIoBaseUpload(
        zip_stream,
        mimetype='application/zip',
        resumable=True
    )

    uploaded_file = drive_service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id'
    ).execute()

    return uploaded_file.get('id')
