from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from server.models import RepositoryModel


class IsOwnerOfRepo(BasePermission):

    def has_permission(self, req, view):

        repo_path = req.query_params.get("repo_path")
        if not repo_path:
            return False
        username = req.user.username
        try:
            repo = RepositoryModel.objects.get(repo_path=repo_path)
        except RepositoryModel.DoesNotExist as e:
            return False
        if repo.owner != username:
            return False
        return True

    def has_init_permission(self, req, view):
        username = req.user.username
        repo_owner = req.query_params.get("username")  # <-- FIXED
        return username and repo_owner == username
