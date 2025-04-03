
from rest_framework import serializers 
 
class FileSerializer(serializers.Serializer):
      file_name=serializers.CharField()
      file_body=serializers.FileField()
 
      def validate(self, attrs):
          if len(attrs["file_name"])==0:
               serializers.ValidationError("File name is required")
          return attrs