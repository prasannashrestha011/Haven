# Generated by Django 5.2 on 2025-04-11 03:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("server", "0018_rename_userstoragedetails_userstoragereference_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="directorymodel",
            name="dirLink",
        ),
        migrations.RemoveField(
            model_name="filemodel",
            name="fileLink",
        ),
        migrations.RemoveField(
            model_name="repositorymodel",
            name="repoLink",
        ),
    ]
