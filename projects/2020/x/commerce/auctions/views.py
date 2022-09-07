from gettext import Catalog
from tracemalloc import start
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms

from .models import Listing, User, Category


def index(request):
    return render(request, "auctions/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

def create(request):
    if request.method == "POST":
        form = CreateListing(request.POST)
        if form.is_valid:
            # get the category, if it is not in the table, add
            # category = request.POST['category']
            # new_category = Auc_categories(category="test catagory")
            # new_category.save()
            # print(Auc_categories.objects.all())
            # title = request.POST['title']
            # description = request.POST['description']
            # starting_bid = request.POST['starting_bid']
            # new_model_instance = Auc_list(title=title, description=description, starting_bid=starting_bid)
            # new_model_instance.save()
            pass
        return HttpResponse("Ok whatever man")
    else: 
        return render(request, "auctions/create.html", {
            'form': CreateListing()
        })


class CreateListing(forms.Form):
    title = forms.CharField(label='title', max_length=64)
    description = forms.CharField(label="description", widget=forms.Textarea())
    starting_bid = forms.DecimalField(label='starting bid', max_digits=11, decimal_places=2)
    image_url = forms.URLField(required=False)
    category = forms.ChoiceField(choices=Category.objects.all())