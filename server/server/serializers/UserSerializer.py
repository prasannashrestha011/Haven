from rest_framework import serializers

from server.models import UserModel, UserStorageReference


class UserSerializer(serializers.ModelSerializer):
    storageID = serializers.SerializerMethodField()

    class Meta:
        model = UserModel
        fields = [
            "userID",
            "username",
            "created_at",
            "updated_at",
            "folder_ref",
            "readme_ref",
            "storageID",
        ]

    def get_storageID(self, obj):
        try:
            return obj.userstoragereference.storageID
        except UserStorageReference.DoesNotExist:
            return None
