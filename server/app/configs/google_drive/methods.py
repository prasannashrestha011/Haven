from googleapiclient.discovery import Resource
from io import BytesIO
from app.configs.google_drive.drive_service import get_drive_service
from googleapiclient.http import MediaIoBaseUpload
from django.core.files.uploadedfile import UploadedFile

def upload_to_drive(file:UploadedFile)->str:
    #Drive resource for uploading the file
    drive_service:Resource=get_drive_service()
    #This is a folder id obtained through shared link where All the uploaded files will be saved in the 
    # personal drive.
    folder_id = "1dqjBHDHoxRtfCZ-QQ3QBpB_poWpnhC4a" 

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