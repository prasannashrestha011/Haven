# Generated by Django 5.2 on 2025-04-29 11:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("server", "0029_alter_usermodel_email"),
    ]

    operations = [
        migrations.RenameField(
            model_name="usermodel",
            old_name="userId",
            new_name="userID",
        ),
    ]
