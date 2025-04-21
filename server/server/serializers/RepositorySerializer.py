from rest_framework import serializers

from server.models import RepositoryModel


class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RepositoryModel
        fields = "__all__"
