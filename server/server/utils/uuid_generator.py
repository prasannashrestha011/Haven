import uuid
import base64

def generate_short_uuid():

    uid = uuid.uuid4()
    # base64 encode and strip padding
    return base64.urlsafe_b64encode(uid.bytes).rstrip(b'=').decode('ascii')
