# Generated by Django 5.0.6 on 2024-08-12 14:52

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_usersettings_user_money_alter_user_avatarid_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='StoreItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('itemID', models.CharField(max_length=48, unique=True)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
                ('price', models.IntegerField()),
            ],
        ),
        migrations.AddField(
            model_name='match',
            name='finishedAt',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Purchase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('purchaseID', models.CharField(max_length=48, unique=True)),
                ('userID', models.CharField(max_length=48)),
                ('purchaseDate', models.DateTimeField(auto_now_add=True)),
                ('itemID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.storeitem')),
            ],
        ),
    ]