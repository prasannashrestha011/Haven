import os
from dotenv import load_dotenv
import dropbox

load_dotenv()


def get_dropbox_service() -> dropbox.Dropbox:
    access_token = os.getenv("DROPBOX_ACCESS_TOKEN")
    refresh_token = os.getenv("DROPBOX_REFRESH_TOKEN")
    app_key = os.getenv("DROPBOX_APP_KEY")
    app_secret = os.getenv("DROPBOX_APP_SECRET")
    if not access_token:
        print("Access token not found")
        return None
    try:
        dbx = dropbox.Dropbox(
            oauth2_access_token=access_token,
            oauth2_refresh_token=refresh_token,
            app_key=app_key,
            app_secret=app_secret,
        )

        # Test the connection
        account = dbx.users_get_current_account()
        print(f"Connected to Dropbox as {account.name.display_name}")
        return dbx
    except dropbox.exceptions.AuthError as e:
        print(f"Authentication error: {e}")
        return None
