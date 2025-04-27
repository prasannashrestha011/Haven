from rest_framework import serializers

from server.models import UserModel


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["userId", "username", "created_at"]
