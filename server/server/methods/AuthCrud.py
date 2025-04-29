from django.shortcuts import get_object_or_404
from server.methods.DropBoxCrud import DropBoxService
from server.models import UserModel, UserStorageReference

from django.contrib.auth.hashers import check_password

from server.serializers.AuthSerializer import LoginSerializer, RegisterSerializer
from server.utils.ResponseBody import ResponseBody
from server.serializers.UserSerializer import UserSerializer


class AuthCrud:

    @staticmethod
    def register_user(user_details):
        try:
            print(user_details)
            req_body = RegisterSerializer(data=user_details)
            if not req_body.is_valid():  # This catches "Username already exists" error
                return {
                    "response": {"error": req_body.errors},
                    "status": 400,
                }

            AuthCrud.catch_field_error(req_body)

            user_model = UserModel.objects.create(**req_body.validated_data)

            # Create the associated storage reference
            storage_reference = UserStorageReference.objects.create(user=user_model)

            # Initialize user folder (e.g., on Dropbox)
            refs = DropBoxService.Init_User_Storage(
                storage_reference.storageID, user_model.username
            )
            if refs["success"]:
                print("Inserting references...")
                user_model.folder_ref = refs["folder_ref"]
                user_model.readme_ref = refs["readme_ref"]
                user_model.save()

            return {
                "response": {
                    "message": "Account registered",
                    "userId": user_model.userId,
                    "storage_referenceID:": storage_reference.storageID,
                },
                "status": 201,
            }

        except Exception as e:
            print(e)
            return {"response": {"error": e}, "status": 500}

    def Fetch_User_Details(userID: str):
        try:
            user_model = UserModel.objects.get(userID=userID)
            serialized_model = UserSerializer(user_model)
            return serialized_model.data
        except UserModel.DoesNotExist as e:
            return None

    @staticmethod
    def Fetch_User_Repo_Reference(username: str):
        try:
            fetched_user = UserModel.objects.prefetch_related(
                "userstoragereference"
            ).get(username=username)
            print(fetched_user.userstoragereference.storageID)
            return fetched_user.userstoragereference.storageID
        except UserModel.DoesNotExist as e:
            return None
        except Exception as e:
            return ResponseBody.build(
                {"error": f"Unknow server error:{str(e)}"}, status=500
            )

    @staticmethod
    def delete_user(user_details):
        try:
            validated_body = LoginSerializer(data=user_details)
            AuthCrud.catch_field_error(validated_body)

            username = validated_body.validated_data.get("username")
            password = validated_body.validated_data.get("password")
            auth_user = UserModel.objects.get(username=username)

        except UserModel.DoesNotExist:
            return {"response": {"error": "User not found"}, "status": 404}
        # performing authentication
        try:
            is_authenticated = check_password(password, auth_user.password)

            if not is_authenticated:
                return {"error": "Invalid username or password", "status": 401}

            DropBoxService.Delete_User_Storage(auth_user.userID)
            auth_user.delete()
            return ResponseBody.build(
                {"message": "User deleted successfully"}, status=200
            )
        except Exception as e:
            return {"response": {"error": str(e)}, "status": 500}

    @staticmethod
    def catch_field_error(req_body):
        if not req_body.is_valid():
            return {"error": req_body.error_messages, "status": 400}
