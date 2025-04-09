
from django.utils import timezone
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from server.utils.uuid_generator import generate_short_uuid

#user model
class UserModel(AbstractUser):
    userId=models.UUIDField(default=uuid.uuid4,unique=True,editable=False)

    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(default=timezone.now)
    folder_link=models.CharField(null=True,blank=True)
    class Meta:
        db_table='users'

class UserStorageReference(models.Model):
    storageID=models.CharField(primary_key=True,default=generate_short_uuid)
    user=models.ForeignKey(UserModel,on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.storageID}-{self.user.username}"
    class Meta:
        db_table='users_storage_reference'

class UserFolders(models.Model):
    user=models.ForeignKey(UserModel,on_delete=models.CASCADE)
    folderLink=models.CharField(null=False,blank=False)
    class Meta:
        db_table='users_folders'

#Dirs and files
class RepositoryModel(models.Model):
    repoID=models.UUIDField(default=uuid.uuid4,unique=True,primary_key=True)
    owner=models.CharField(blank=True,null=True)
    name=models.CharField(max_length=255,null=True,blank=True)
    class Meta:
        db_table='repositories'

class DirectoryModel(models.Model):
    dirID=models.UUIDField(default=uuid.uuid4,unique=True,primary_key=True)
    dirName=models.CharField(max_length=255,default='repo_name')
    repo=models.ForeignKey(RepositoryModel,on_delete=models.CASCADE)
    parent_dir=models.ForeignKey('self',null=True,blank=True,on_delete=models.CASCADE)
    class Meta:
        db_table='directories'

class FileModel(models.Model):
    fileID=models.UUIDField(default=uuid.uuid4,unique=True,primary_key=True)
    fileName=models.CharField(unique=False,max_length=255,blank=False)
    directory=models.ForeignKey(DirectoryModel,on_delete=models.CASCADE,null=True,blank=True)
    repo=models.ForeignKey(RepositoryModel,on_delete=models.CASCADE,null=True,blank=True)
    class Meta:
        db_table='files'
