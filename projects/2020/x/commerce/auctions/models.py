from gettext import Catalog
from pyexpat import model
from tkinter import CASCADE
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Category(models.Model):
    category = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return f"{self.category}"

class Bid(models.Model):
    value = models.DecimalField(max_digits=11, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    
    def __str__(self):
        return f"{Listing.objects.get(bid=self)}: {self.value}: {self.user}"


class Listing(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField()
    starting_bid = models.DecimalField(max_digits=11, decimal_places=2)
    bid = models.ForeignKey(Bid, null=True, blank=True, default=None, on_delete=models.SET_DEFAULT, related_name="item")
    image = models.URLField(max_length=300, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title}"

class User_Comment(models.Model):
    comment = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user}: {self.listing}: {self.comment}"

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user}: {self.listing}"