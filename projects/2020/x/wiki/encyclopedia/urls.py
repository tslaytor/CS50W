from re import search
from unicodedata import name
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:entry>", views.entry, name="entry"),
    path("search/", views.search, name="search"),
    path("create-page/", views.create, name="create"),
    path("edit/<str:title>", views.edit, name="edit"),
    path("rand/", views.rand, name="rand")
]
