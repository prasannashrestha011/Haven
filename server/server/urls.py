from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

from server.views.Auth import AuthView
from server.views.FileUploader import FileParserView
from server.views.ZipView import ZipView

urlpatterns=[
    path('auth/token',TokenObtainPairView.as_view()),
    path('auth/refresh',TokenRefreshView.as_view()),
    path('auth/register',AuthView.as_view({"post":"register_user"})),
    path('file',FileParserView.as_view()),
    path('zip',ZipView.as_view())
]