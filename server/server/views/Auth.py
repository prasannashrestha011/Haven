from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import AccessToken,RefreshToken

from server.configs.google_drive.methods import create_user_folder
from server.models import UserModel
from server.serializers.AuthSerializer import LoginSerializer, RegisterSerializer
from django.contrib.auth.hashers import check_password



class AuthView(ViewSet):
    permission_classes=[AllowAny]

    @action(detail=False,methods=['POST'])
    def register_user(self,req:Request):
       try:
        req_body=RegisterSerializer(data=req.data)
        if not req_body.is_valid():
            non_field_error=req_body.errors.get('non_field_errors')
            if non_field_error:
               return Response({"error":non_field_error},status=400)
            return Response({"error":req_body.errors},status=400)
        
        self.catch_field_error(req_body)
        print("Details->",req_body.data)
        user_model=UserModel.objects.create(**req_body.data) 
        folder_id=create_user_folder(user_model.userId)

        return Response({"message":"Account registered",
                          "userId":user_model.userId,"folder_id":folder_id})
       except Exception as e:
         return Response({"error":"unknow error"},status=500)
    
    @action(detail=False,methods=["POST"])
    def login_user(self,req:Request):

        req_body=LoginSerializer(data=req.data)      
        print("Request body->",req_body)
        self.catch_field_error(req_body)
     
        auth_user=UserModel.objects.get(username=req_body.data["username"])
        is_authenticated=check_password(req_body.data["password"],auth_user.password)
     
        if not is_authenticated:
           return Response({"error":"Invalid username or password"},status=401)
        authToken=AccessToken.for_user(user=auth_user)

        response= Response({"message":"User authenticated"})
        response['Authorization']=f'Bearer {authToken}'
        return response
        
    def catch_field_error(self,req_body):
      if not req_body.is_valid():
        return Response(req_body.error_messages,status=400)