
from django.urls import path
from django.contrib.auth.decorators import login_required

from . import views

urlpatterns = [
    path("", views.PostListAllView.as_view(), name="index"),
    path("profile/<profile>", views.ProfileView, name="profile"),
    path("following", views.FollowingPage.as_view(), name="following"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API routes
    path("createpost", views.create_post, name="post"),
    path("follow", views.follow_view, name="follow_view"),
    path("liked/<int:post_id>", views.liked, name="liked")
]
