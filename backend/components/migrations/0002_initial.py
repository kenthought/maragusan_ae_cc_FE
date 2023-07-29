# Generated by Django 4.2.2 on 2023-07-19 17:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('components', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='province',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='province', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='municipality',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='municipality', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='barangay',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='barangay', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='assettype',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='asset_type', to=settings.AUTH_USER_MODEL),
        ),
    ]