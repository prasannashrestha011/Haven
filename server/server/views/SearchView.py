from rest_framework.viewsets import ViewSet
from rest_framework.request import Request
from rest_framework.response import Response
from server.methods.search.search_methods import SearchMethod
from server.serializers.RepositorySerializer import RepositorySerializer
from server.utils.ResponseBody import ResponseBody


class SearchView(ViewSet):

    def find_repositories(self, req: Request):
        repo_name = req.query_params.get("repo_name")
        if not repo_name:
            responseBody = ResponseBody.build(
                {"error": "repository name not provided"}, status=400
            )
            return Response(responseBody["message"], status=responseBody["status"])
        search_result = SearchMethod.find_repo_by_name(repo_name=repo_name)
        serialized_list = RepositorySerializer(search_result)
        return Response({"list": serialized_list.data}, status=200)

    def find_users(self, req: Request):
        username = req.query_params.get("username")
        if not username:
            return Response({"error": "username not provided"}, status=400)
        search_result = SearchMethod.find_users(username=username)
        return Response({"users": search_result}, status=200)
