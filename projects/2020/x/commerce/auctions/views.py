from calendar import c, prmonth
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
from flask_login import login_required
from django.contrib.auth.decorators import login_required
from django.db.models import Exists, OuterRef
from django.core.exceptions import ObjectDoesNotExist
from urllib3 import HTTPResponse

from .models import Listing, User, Category, Bid, Watchlist

def index(request):
    # x = Listing.objects.all()
    # for i in x:
    #     print(f"This is the id: {i.id}, this is the title: {i.title}")
    
    
    # ok = Listing.bid
    # print(ok)
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.all().order_by("-id"),
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

@login_required(login_url = '/login')
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

@login_required(login_url = '/login')
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
        return HttpResponseRedirect(reverse('index'))
    else:
        return render(request, 'auctions/create.html', {
            'form': CreateListing()
        })

class CreateListing(forms.Form):
    title = forms.CharField(label='Title', max_length=64)
    description = forms.CharField(label="Description", widget=forms.Textarea())
    image_url = forms.URLField(label='Image URL', required=False)
    starting_bid = forms.DecimalField(widget=forms.NumberInput(attrs={'class': 'short-input'}), label='Starting bid', max_digits=11, decimal_places=2)
    category = forms.ChoiceField(widget=forms.Select(attrs={'class': 'short-input'}), label='Category', choices=[(x.id, x.category) for x in Category.objects.all()])

@login_required(login_url = '/login')
def listing(request, listing_id):
    listing = Listing.objects.get(id=listing_id)
    watchlist = Watchlist.objects.filter(user=request.user, listing=listing)
    if watchlist:
        in_list = True
    else:
        in_list = False
  
    return render(request, 'auctions/listing.html', {
        'listing': listing,
        'form': WatchForm(initial={'listing_id': listing_id}),
        "in_list": in_list,
        'bid_form': BidForm(initial={'listing_id': listing_id}),
    })

class WatchForm(forms.Form):
    listing_id = forms.IntegerField(widget=forms.HiddenInput())

class BidForm(forms.Form):
    bid = forms.DecimalField(widget=forms.NumberInput(attrs={'class': 'short-input'}), label='', max_digits=11, decimal_places=2)
    listing_id = forms.IntegerField(widget=forms.HiddenInput())


@login_required(login_url = '/login')
def watchlist(request):
    if request.method == 'POST':
        watch_form = WatchForm(request.POST)
        if watch_form.is_valid():
            x = watch_form.cleaned_data
            listing = Listing.objects.get(id=x['listing_id'])

            try:
                it_exists = Exists(Watchlist.objects.get(user=request.user, listing=listing))
            except ObjectDoesNotExist:
                it_exists = False
            if it_exists:
                 return render(request, 'auctions/watchlist.html', {
                 'empty': True
                 })
            
            else:
                Watchlist.objects.create(user=request.user, listing=listing)
                return render(request, 'auctions/watchlist.html', {
                'watchlist': Watchlist.objects.all().filter(user = request.user)
                })

        return HttpResponse("the form is not valid")
    else:
        return render(request, 'auctions/watchlist.html', {
        'watchlist': Watchlist.objects.all().filter(user = request.user)
        })

@login_required(login_url = '/login')
def remove_from_watchlist(request):
    if request.method == 'POST':
        # listing_id = request.POST('value')
        watch_form = WatchForm(request.POST)
        if watch_form.is_valid():
            x = watch_form.cleaned_data
            print(f" FFFFFFFFFFFF {x}")
            listing = Listing.objects.get(id=x['listing_id'])
            Watchlist.objects.filter(user=request.user, listing=listing).delete()
        else:
            return HttpResponse("The form isn't valid")
    return HttpResponseRedirect(reverse('listing', args=(x['listing_id'],)))

@login_required(login_url = '/login')
def bid(request):
    if request.method == 'POST':
        submitted_bid = BidForm(request.POST)
        if submitted_bid.is_valid():
            bid_amount = submitted_bid.cleaned_data['bid']
            listing_id = submitted_bid.cleaned_data['listing_id']

            # get the listing instance
            listing_instance = Listing.objects.get(id=listing_id)

            # and the values from the instance
            starting_bid = listing_instance.starting_bid
            

            if bid_amount < starting_bid:
                return HttpResponse("Your bid is too low")
            else:
                #  else check if there are other bids
                current_bid = listing_instance.bid
                if not current_bid:
                    new_bid = Bid.objects.create(value=bid_amount, user=request.user)
                    new_bid.save()

                    listing_instance.bid = new_bid
                    listing_instance.save()
                    return HttpResponseRedirect(reverse('listing', args=(listing_id,)))

                elif bid_amount <= current_bid.value:
                    return HttpResponse("Your bid is Lower than the current bid - too low")
                else:
                    # replace the value in the listing.bid
                    #  make a new bid model instance
                    new_bid = Bid.objects.create(value=bid_amount, user=request.user)
                    new_bid.save()
                    # update the bid model instance listing refers to
                    listing_instance.bid = new_bid
                    listing_instance.save()
                    # assign new model instance to the listing object
                    
                    return HttpResponseRedirect(reverse('listing', args=(listing_id,)))

        else:
            return HttpResponse("NOT A VALID BID")
    else:
        return HttpResponse("you ended here")
            # y = listing.values()
            # print(f"YYYYYYYYYYYYYYY {listing}")
            # listing_instance = listing.first()
            # print(f"Listing INSTANCE:  {listing.starting_bid}")
            # print(f"YAAAAAA: {clean_bid} ")
    

            # print(f"check this!!!!!!!!!!!! ====== {listing['id']}")
            # print(f"check this!!!!!!!!!!!! ====== {clean_bid['bid']}")
            # return HttpResponse("read the prints")


            # if y['starting_bid'] < x['bid']:

            #     return HttpResponse("Bid too low")
            # if x['bid'] < int(listing['starting_bid']):
            #     return HttpResponse("The bid was too low")
                # check no other bids
                    # iadd the bid and return
                #  else
                    # check if this bid is bigger than existing bid
                        # if it is, delete exisiting bid and add this bid (replace?)
                    #  if not, reject the bid
            # else reject, bid too low