# Generated by Django 5.0.6 on 2024-10-07 15:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0027_rename_description_storeitem_assetid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchase',
            name='itemID',
            field=models.CharField(max_length=48),
        ),
    ]
