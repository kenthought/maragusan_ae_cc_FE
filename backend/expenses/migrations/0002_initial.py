# Generated by Django 4.2.2 on 2023-09-16 10:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('components', '0002_initial'),
        ('expenses', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='ledger',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='expenses_ledger', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='expenses',
            name='expenses_category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='expenses', to='components.expensescategory'),
        ),
        migrations.AddField(
            model_name='expenses',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='expenses', to=settings.AUTH_USER_MODEL),
        ),
    ]
