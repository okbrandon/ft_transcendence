# Generated by Django 5.0.6 on 2024-09-23 14:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_alter_conversation_conversationid_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='status',
            field=models.JSONField(null=True),
        ),
    ]
