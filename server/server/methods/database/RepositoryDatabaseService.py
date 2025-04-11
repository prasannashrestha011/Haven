from server.models import RepositoryModel, UserStorageReference
from django.shortcuts import get_object_or_404


class RepoDbService:

    @staticmethod
    def is_user_storage_ref_valid(user_storage_ref: str) -> bool:
        return UserStorageReference.objects.filter(storageID=user_storage_ref).exists()

    @staticmethod
    def is_repo_path_valid(repo_path: str) -> bool:
        return RepositoryModel.objects.filter(repo_path=repo_path).exists()

    @staticmethod
    def fetch_repo(repo_path: str) -> RepositoryModel:
        try:
            return RepositoryModel.objects.get(repo_path=repo_path)
        except RepositoryModel.DoesNotExist:
            return None

    @staticmethod
    def delete_repo(repo_path: str) -> bool:
        deleted_count, _ = RepositoryModel.objects.filter(repo_path=repo_path).delete()
        return deleted_count > 0
