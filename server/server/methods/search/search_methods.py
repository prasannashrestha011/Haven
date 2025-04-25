from re import search
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

from server.models import RepositoryModel


class SearchRepositories:

    @staticmethod
    def find_repo_by_name(repo_name: str):
        search_query = SearchQuery(repo_name)
        queryset = (
            RepositoryModel.objects.annotate(
                search=SearchVector("repoName", "des"),
                rank=SearchRank(SearchVector("repoName", "des"), search_query),
            )
            .filter(search=search_query)
            .order_by("-rank")
        )
        return queryset
