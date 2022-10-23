from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Posts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    likes = models.IntegerField(default=0)

class followers(models.Model):
    user = models.ForeignKey(User, related_name='user', on_delete=models.CASCADE)
    follower = models.ForeignKey(User, related_query_name='follower', on_delete=models.CASCADE)