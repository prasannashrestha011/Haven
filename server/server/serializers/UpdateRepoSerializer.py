from rest_framework import serializers


class UpdateRepoSerializer(serializers.Serializer):
    repoID = serializers.CharField(required=True)
    newRepoName = serializers.CharField(max_length=250, required=False)
    newRepoDes = serializers.CharField(max_length=500, required=False)

    def validate(self, attrs):
        newRepoName = attrs.get("newRepoName")
        newRepoDes = attrs.get("newRepoDes")

        if newRepoName is not None and len(newRepoName) < 3:
            raise serializers.ValidationError(
                {"newRepoName": "New repository name must be at least 3 characters"}
            )

        if newRepoDes is not None and len(newRepoDes) < 5:
            raise serializers.ValidationError(
                {
                    "newRepoDes": "New repository description must be at least 5 characters"
                }
            )

        return attrs
