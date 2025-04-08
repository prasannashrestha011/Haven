from rest_framework.views import APIView 
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from server.configs.google_drive.methods import upload_to_drive
from server.serializers.FileSerializer import FileSerializer   
from rest_framework.permissions import IsAuthenticated

class FileParserView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,req:Request):
        user=req.query_params.get("user")
        return Response({"name":user})  
    
    def post(self,req:Request):
        user_id=req.query_params.get("userID")
        body=FileSerializer(data=req.data)
        if not body.is_valid():
            return Response({"error":body.error_messages},status=400)
        
        file_name=body.validated_data.get("file_name")
        file_body=body.validated_data.get("file_body")
        print(file_name)
        
        uploaded_file_id= upload_to_drive(file=file_body)
        
        return Response({"message":"success",
                         "id":uploaded_file_id})