from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from server.custom_methods.Custom_TokenView import CustomTokenView
from server.views.Auth import AuthView
from server.views.FileContentView import FileContentView
from server.views.ZipView import ZipView
from server.views.DropBoxView import dropbox_oauth, dropbox_oauth_callback

urlpatterns = [
    # auth routes
    path("auth/token", CustomTokenView.as_view()),
    path("auth/refresh", TokenRefreshView.as_view()),
    path("auth/register", AuthView.as_view({"post": "register_user"})),
    path("auth/details", AuthView.as_view({"get": "fetch_user_repo_details"})),
    path("auth/delete", AuthView.as_view({"delete": "delete_user"})),
    # repo routes
    path("repo/list", ZipView.as_view({"get": "get_repo_list"})),
    path("repo/structure", ZipView.as_view({"get": "get_repo_structure"})),
    path("repo/content", FileContentView.as_view()),
    path("repo/init", ZipView.as_view({"post": "init_repo"})),
    path("repo/insert", ZipView.as_view({"post": "insert_repo"})),
    path("repo/delete", ZipView.as_view({"delete": "delete_repo"})),
    path("repo/delete/all", ZipView.as_view({"delete": "delete_all_repos"})),
    path("repo/update", ZipView.as_view({"patch": "update_repo_details"})),
    path("dropbox/oauth/", dropbox_oauth, name="dropbox_oauth"),
    path(
        "dropbox/oauth/callback/", dropbox_oauth_callback, name="dropbox_oauth_callback"
    ),
]
