import os
import tempfile
import uuid
import zipfile
from django.conf import settings
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from server.models import RepositoryModel,DirectoryModel


class ZipView(APIView):
    permission_classes = [AllowAny]

    def post(self, req: Request):
        file_struct={}
        zip=req.FILES.get('zip')
        user=req.query_params.get('user')
        repo_name=req.query_params.get('repo')
        if not zip:
            return Response({"message":"no zip file found"},status=400)
        temp_dir=tempfile.mkdtemp()
        with zipfile.ZipFile(zip.file,'r') as zip_ref:
            zip_ref.extractall(temp_dir)

        repo=RepositoryModel.objects.create(name=repo_name,owner=user)

        with transaction.atomic():
            for root,dirs,files in os.walk(temp_dir):
              
               for file in files: 
                 
                 path=os.path.join(root,file)          
                 rel_file_path=os.path.relpath(path,start=temp_dir)
                 parent_dir=os.path.dirname(rel_file_path)
                 
                 #getting filename 
                 filename=os.path.basename(rel_file_path)
                 
                 folder,created=DirectoryModel.objects.get_or_create(
                     repo=repo,
                 )
                 if not created:
                     DirectoryModel(
                         repo=repo
                     )
                 if parent_dir not in file_struct:
                     file_struct[parent_dir]=[]

                 file_struct[parent_dir].append(filename)
                    
               
        return Response({"message":file_struct},status=200)
