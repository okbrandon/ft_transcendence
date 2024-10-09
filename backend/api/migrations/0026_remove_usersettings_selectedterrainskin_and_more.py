# Generated by Django 5.0.6 on 2024-10-07 14:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_remove_usersettings_colorblind_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usersettings',
            name='selectedTerrainSkin',
        ),
        migrations.AlterField(
            model_name='usersettings',
            name='selectedPaddleSkin',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.storeitem'),
        ),
    ]
