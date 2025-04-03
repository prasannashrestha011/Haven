from django.urls import path

from app.views.FileParser import FileParserView



urlpatterns=[
    path("file/",FileParserView.as_view())
]