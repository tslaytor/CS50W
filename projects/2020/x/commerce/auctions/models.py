from gettext import Catalog
from pyexpat import model
from tkinter import CASCADE
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Auc_catagories(models.Model):
    catagory = models.CharField(max_length=64)

class Auc_list(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField()
    starting_bid = models.DecimalField(max_digits=11, decimal_places=2)
    image = models.URLField(blank=True)
    catagory = models.ForeignKey(Auc_catagories, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # I think we don't need current bid, we store all bid info on another table
    # current_bid = models.DecimalField(blank=True, max_digits=11, decimal_places=2)

class Watch_list(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    auc_list = models.ForeignKey(Auc_list, on_delete=models.CASCADE)

class Comments(models.Model):
    comment = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    auc_list = models.ForeignKey(Auc_list, on_delete=models.CASCADE)

class Bids(models.Model):
    value = models.DecimalField(max_digits=11, decimal_places=2)
    auc_list = models.ForeignKey(Auc_list, on_delete=models.CASCADE)