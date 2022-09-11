from email.mime import image
from gettext import Catalog
from tracemalloc import start
from unicodedata import category
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms

from .models import Listing, User, Category, Bid


def index(request):
    # x = Listing.objects.all()
    # for i in x:
    #     print(f"This is the id: {i.id}, this is the title: {i.title}")
    
    
    # ok = Listing.bid
    # print(ok)
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.all(),
        # "bids": Bid.objects.all()
    })


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
            title = request.POST['title']
            description = request.POST['description']
            starting_bid = request.POST['starting_bid']
            image_url = request.POST['image_url']
            category = Category.objects.get(id = request.POST['category'])
            user = request.user
            new_listing = Listing(title=title, 
                                description=description, 
                                starting_bid=starting_bid, 
                                image=image_url, 
                                category=category, 
                                user=user)
            new_listing.save()
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
    category = forms.ChoiceField(choices=[(x.id, x.category) for x in Category.objects.all()])
