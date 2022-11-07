from django import template
from network.models import User, Post, Follower

register = template.Library()

# def liked(user, Post):
#     return post(likes=user).exists()

@register.simple_tag
def liked(post, liked_by):
    return post.likes.contains(liked_by)