from audioop import reverse
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='poster')
    created = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    likes = models.ManyToManyField(User, related_name='likes', blank=True)

    def __str__(self):
        return f"User: {self.user}, Created: {self.created}, Content: {self.content}, Likes: {self.likes}"

    # def myserializer(self):
    #     return {
    #         'user': self.user.username,
    #         'created': self.created.strftime('%b %-d %Y, %-I:%M %p'),
    #         'content': self.content,
    #         'likes': self.likes
    #     }

class Follower(models.Model):
    user = models.ForeignKey(User, related_name='user', on_delete=models.CASCADE)
    follower = models.ForeignKey(User, related_query_name='follower', on_delete=models.CASCADE)

    def is_valid_follower(self):
        return self.user.username != self.follower.username

