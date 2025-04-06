import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

from googleapiclient.discovery import Resource

SCOPES = ['https://www.googleapis.com/auth/drive']
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, 'credentials.json')

def get_drive_service()->Resource:
    creds=service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE,
                                                                scopes=SCOPES)
                  #service #version #acc details   
    return build('drive','v3',credentials=creds)