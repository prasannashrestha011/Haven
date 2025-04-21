from rest_framework import serializers


class NewRepoSerializer(serializers.Serializer):
    repo_name = serializers.CharField(max_length=255, required=True, allow_blank=False)
    repo_des = serializers.CharField(max_length=500, required=False, allow_blank=True)
    username = serializers.CharField(max_length=255, required=True, allow_blank=False)

    def validate(self, attrs):
        repo_name = attrs.get("repo_name", "")

        username = attrs.get("username", "")
        if len(repo_name.strip()) < 3:
            raise serializers.ValidationError(
                {"repo_name": "Repository name must be at least 3 characters long."}
            )
        if len(username.strip()) < 3:
            raise serializers.ValidationError(
                {"username": "Username must be at least 3 characters"}
            )

        return attrs
