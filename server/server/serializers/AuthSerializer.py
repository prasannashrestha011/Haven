from rest_framework import serializers
from django.contrib.auth.hashers import make_password

from server.views.Auth import UserModel

class RegisterSerializer(serializers.Serializer):
    username=serializers.CharField(max_length=250)
    password=serializers.CharField(max_length=250)
    def validate(self, attrs):
        if len(attrs["username"])<5:
            raise serializers.ValidationError("Username should be atleast 5 character")
        if len(attrs["password"])<8:
            raise serializers.ValidationError("Password should be atleast 8 characters")
        if UserModel.objects.filter(username=attrs["username"]).exists():
            raise serializers.ValidationError("Username already exists")

        attrs["password"]=make_password(attrs["password"])
        return attrs
    
    
class LoginSerializer(serializers.Serializer):
    username=serializers.CharField(max_length=250)
    password=serializers.CharField(max_length=250)
    def validate(self, attrs):
        if len(attrs["username"])<5:
            raise serializers.ValidationError("Username should be atleast 5 character")
        if len(attrs["password"])<8:
            raise serializers.ValidationError("Password should be atleast 8 characters")
        return attrs
   