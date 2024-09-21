# Generated by Django 5.0.6 on 2024-09-20 10:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_alter_conversation_conversationid_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='receipientID',
            field=models.CharField(max_length=48, null=True),
        ),
        migrations.AlterField(
            model_name='conversation',
            name='conversationID',
            field=models.CharField(default='conv_MTcyNjgyNjkwOTA2NzY1MjA', editable=False, max_length=48, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='message',
            name='messageID',
            field=models.CharField(default='msg_MTcyNjgyNjkwOTA2ODE3NTI', editable=False, max_length=48, primary_key=True, serialize=False),
        ),
    ]