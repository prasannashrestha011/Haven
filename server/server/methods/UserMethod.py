from django.shortcuts import get_object_or_404
from server.models import UserModel, UserStorageReference


class UserMethods:
    @staticmethod
    def fetch_user_details(username: str):
        try:
            user = UserModel.select_related("userstoragereference").get(
                username=username
            )
            user_details = {
                "userID": user.userId,
                "username": user.username,
                "email": user.email,
                "storageID": user.userstoragereference.storageID,
            }
        except UserModel.DoesNotExist as e:
            return {"error": "User not found"}

    @staticmethod
    def fetch_storageID(username: str):
        try:
            storage_reference = UserStorageReference.objects.get(
                user__username=username
            )
            return storage_reference.storageID

        except UserStorageReference.DoesNotExist as e:
            return {"error": "storage reference doesnot exists"}
