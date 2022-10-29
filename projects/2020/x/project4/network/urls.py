
from django.urls import path

from . import views

urlpatterns = [
    path("", views.PostListView.as_view(), name="index"),
    path("profile/<profile>", views.PostListByUserView.as_view(), name="profile"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API routes
    path("createpost", views.create_post, name="post"),
    path('listposts/<str:username>', views.list_posts, name="list"),
    path('get_followers/<str:username>', views.get_followers, name="get_profile")
]
