# Generated by Django 4.2.2 on 2023-09-19 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdata',
            name='email',
            field=models.EmailField(blank=True, max_length=100, unique=True),
        ),
    ]
