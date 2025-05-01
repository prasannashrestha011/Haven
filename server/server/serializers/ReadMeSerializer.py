from rest_framework import serializers


class ReadeMeSerializer(serializers.Serializer):
    file_name = serializers.CharField()
    content = serializers.CharField()

    def validate(self, attrs):
        if len(attrs["file_name"]) == 0:
            serializers.ValidationError("File name is required")
        return attrs
