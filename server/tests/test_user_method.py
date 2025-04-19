from django.test import TestCase

from server.methods.UserMethod import UserMethods
from server.models import UserModel, UserStorageReference


class UserModelTest(TestCase):
    def setUp(self):
        self.user = UserModel.objects.create(
            username="prasanna123",
            email="prasanna123@gmail.com",
            password="prasanna123",
        )
        self.storage_reference = UserStorageReference.objects.create(
            user=self.user, storageID="xxal231xvafasdf"
        )

    def test_fetch_user_storageID(self):
        result = UserMethods.fetch_storageID("prasanna123")
        self.assertIn("user", result)
        self.assertIn("storageID", result)
        print(result)
        self.assertEqual(result["user"].username, "prasanna123")
