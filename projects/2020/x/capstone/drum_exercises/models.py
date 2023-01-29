from django.db import models
from django.contrib.auth.models import AbstractUser
# from django.contrib.postgres.fields import JSONField


class User(AbstractUser):
    pass


class Exercise(models.Model):
    created_by: models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_by')
    date_created: models.DateField(auto_now_add=True)
    exercise: models.TextField()
    
