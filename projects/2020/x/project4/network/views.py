from cgi import print_environ_usage
import profile
from queue import Empty
import re
from tkinter import E
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
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.template import RequestContext
from django.contrib.auth.decorators import login_required

from .models import User, Post, Follower

NUM_POSTS_PER_PAGE = 2

class PostListAllView(ListView):
    paginate_by = NUM_POSTS_PER_PAGE
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

def ProfileView(request, profile):
    posts_list = Post.objects.filter(user=User.objects.get(username=profile)).order_by('-created')
    page = request.GET.get('page', 1)
    paginator = Paginator(posts_list, NUM_POSTS_PER_PAGE)

    try: 
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(1)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)

    profile = User.objects.get(username=profile)
    if request.user.is_authenticated:
        context ={
            'profile': profile,
            'logged_in': True,
            'followers': Follower.objects.filter(user=User.objects.get(username=profile)).count(),
            'following': Follower.objects.filter(follower=User.objects.get(username=profile)).count(),
            'user_is_following': Follower.objects.filter(user=profile, follower=User.objects.get(username=request.user)).exists(),
            'posts': posts
        }
        
    else:
        context ={
            'profile': profile,
            'posts': posts
        }
    return render(request, 'network/index.html', context)


class FollowingPage(ListView):
    paginate_by = NUM_POSTS_PER_PAGE
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
        return Post.objects.filter(user__in=profiles).order_by('-created')


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
    # check if the post already exists

    if content['post_id']:
        print('yo')
        # get the post
        post = Post.objects.get(id=content['post_id'])
        # update the post
        post.content = content['content']
        post.save()
        return JsonResponse({"message": "Post updated successfully."}, status=201)
        
    else:
        print(request.user)
        post = Post(
            user = request.user,
            content = content['content']
        )
        post.save()
        return JsonResponse({"message": "Post saved successfully."}, status=201)

@login_required
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