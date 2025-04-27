from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.db.models import Q
from server.models import RepositoryModel, UserModel


class SearchMethod:

    @staticmethod
    def find_repo_by_name(repo_name: str):
        search_query = SearchQuery(repo_name)
        queryset = (
            RepositoryModel.objects.annotate(
                search=SearchVector("repoName", "des"),
                rank=SearchRank(SearchVector("repoName", "des"), search_query),
            )
            .filter(Q(repoName__icontains=repo_name))
            .order_by("-rank")
        )

        return queryset

    @staticmethod
    def find_users(username: str):
        search_query = SearchQuery(username)
        queryset = (
            (
                UserModel.objects.annotate(
                    search=SearchVector("username"),
                    rank=SearchRank(SearchVector("username"), search_query),
                )
            )
            .filter(Q(username__icontains=username))
            .order_by("-rank")
        )
        return queryset
