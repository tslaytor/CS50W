import profile
import re
from typing import List
from urllib import request
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json
from django.core import serializers
from django.views.generic import ListView
from django.core.paginator import Paginator
from django.template import RequestContext

from .models import User, Post, Follower

class PostListAllView(ListView):
    paginate_by = 3
    model = Post
    ordering = ['-created']
    context_object_name = "posts"
    template_name = "network/index.html"

    def get_context_data(self, **kwargs):
        context = super(PostListAllView, self).get_context_data(**kwargs)
        context.update({
            'home': True
        })
        return context

class PostListByUserView(ListView):
    paginate_by = 3
    context_object_name = "posts"
    ordering = ['-created']
    template_name = "network/index.html"
    
    def get_context_data(self, **kwargs):
        profile = User.objects.get(username=self.kwargs['profile'])
        context = super(PostListByUserView, self).get_context_data(**kwargs)
        context.update({
            'profile': profile,
            'followers': Follower.objects.filter(user=User.objects.get(username=self.kwargs['profile'])).count(),
            'following': Follower.objects.filter(follower=User.objects.get(username=self.kwargs['profile'])).count(),
            'user_is_following': Follower.objects.filter(user=profile, follower=User.objects.get(username=self.request.user)).exists(),
            'user': self.request.user
        })
        return context

    def get_queryset(self):
        self.profile = get_object_or_404(User, username=self.kwargs['profile'])
        return Post.objects.filter(user=self.profile)

class FollowingPage(ListView):
    paginate_by = 3
    context_object_name = "posts"
    ordering = ['-created']
    template_name = "network/index.html"
    
    def get_context_data(self, **kwargs):
        context = super(FollowingPage, self).get_context_data(**kwargs)
        context.update({
            'following_page': True
            
        })
        return context

    def get_queryset(self):
        following = Follower.objects.filter(follower=self.request.user)
        print(following)
        profiles = User.objects.filter(user__in=following)
        print(profiles)
        print(Post.objects.filter(user__in=profiles))
        return Post.objects.filter(user__in=profiles)


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
    c = RequestContext(request)
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    # get the content of the post and create an instance of the post model
    content = json.loads(request.body)
    post = Post(
        user = request.user,
        content = content 
    )
    post.save()
    return JsonResponse({"message": "Post saved successfully."}, status=201)

def follow_view(request):
    c = RequestContext(request)
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    # get the content of body and check if user is following profile already
    data = json.loads(request.body)

    profile = User.objects.get(username=data['profile'])
    following = Follower.objects.filter(user=User.objects.get(username=profile), follower=request.user).exists()


    if following:
        # unfollow
        Follower.objects.filter(user=profile, follower=request.user).delete()
    else:
        # follow
        f = Follower(user=profile, follower=request.user)
        f.save()
    # return JsonResponse({"total_followers": 5})
    return JsonResponse({
        "total_followers": Follower.objects.filter(user=profile).count(),
        "set_button_to_unfollow": Follower.objects.filter(user=profile, follower=request.user).exists()
    })