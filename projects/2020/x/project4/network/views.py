from typing import List
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json
from django.core import serializers
from django.views.generic import ListView
from django.core.paginator import Paginator

from .models import User, Post, Follower

class PostListView(ListView):
    paginate_by = 3
    model = Post
    context_object_name = "posts"
    template_name = "network/index.html"

def index(request):
    # posts = Post.objects.all()
    # pages = Paginator(posts, 2)
    # print(posts)
    return render(request, "network/index.html", {
        
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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
def create_post(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # get the content of the post
    content = json.loads(request.body)
    # create an instance of the post model
    post = Post(
        user = request.user,
        content = content 
    )
    post.save()
    print('here now')
    print(content)
    return JsonResponse({"message": "Post saved successfully."}, status=201)

def list_posts(request, username):
    if username == 'all':
        posts = Post.objects.all().order_by('-created')
    else:
        user = User.objects.get(username=username)
        posts = Post.objects.filter(user=user).order_by('-created')
    
    return JsonResponse([post.myserializer() for post in posts], safe=False)

def get_followers(request, username):
    user = User.objects.get(username=username)
    return JsonResponse(
        {
            "followers": Follower.objects.filter(user=user).count(), 
            "following": Follower.objects.filter(follower=user).count()
        }
    )

