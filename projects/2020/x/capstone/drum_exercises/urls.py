from unicodedata import name
from django.urls import path
from django.contrib.auth.decorators import login_required
from django.urls import path
from . import views

urlpatterns = [
    path('create', views.create, name="create")
]