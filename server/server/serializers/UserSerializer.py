from rest_framework import serializers

from server.models import UserModel


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = [
            "userID",
            "username",
            "created_at",
            "updated_at",
            "folder_ref",
            "readme_ref",
        ]
