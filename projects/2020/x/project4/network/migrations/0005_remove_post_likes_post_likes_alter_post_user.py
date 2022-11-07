# Generated by Django 4.0.2 on 2022-11-07 07:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_rename_followers_follower_rename_posts_post'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='likes',
        ),
        migrations.AddField(
            model_name='post',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='likes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='post',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='poster', to=settings.AUTH_USER_MODEL),
        ),
    ]
