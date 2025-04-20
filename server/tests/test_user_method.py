import django
from django.test import TestCase
from rest_framework.request import Request
from rest_framework.response import Response

from server.methods.DropBoxCrud import DropBoxService
from server.methods.UserMethod import UserMethods
from server.models import UserModel, UserStorageReference
from rest_framework.test import APIRequestFactory

from server.views.ZipView import ZipView


class UserModelTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.views = ZipView()
        self.user = UserModel.objects.create(
            username="prasanna123",
            email="prasanna123@gmail.com",
            password="prasanna123",
        )
        self.storage_reference = UserStorageReference.objects.create(
            user=self.user, storageID="xxal231xvafasdf"
        )
        DropBoxService.Init_Repo_Dir = lambda *args, **kwargs: {
            "success": True,
            "message": "Repo created",
        }

    def test_fetch_user_storageID(self):
        result = UserMethods.fetch_storageID("prasanna123")

        print(result)
        self.assertEqual("xxal231xvafasdf", "xxal231xvafasdf")

    def test_init_repo_success(self):
        raw_request = self.factory.get("/init-repo?repo=myrepo&username=prasanna123")
        request = Request(request=raw_request)
        response: Response = self.views.init_repo(request)
        self.assertEqual(response.status_code, 201)
