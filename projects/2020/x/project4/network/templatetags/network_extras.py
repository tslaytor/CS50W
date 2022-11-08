from django import template
from network.models import User, Post, Follower

register = template.Library()

@register.simple_tag
def liked(post, liked_by):
    return post.likes.contains(liked_by)