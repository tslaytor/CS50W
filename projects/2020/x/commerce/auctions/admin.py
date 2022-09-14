from django.contrib import admin

from .models import Category, Listing, Watchlist, User_Comment, Bid

# Register your models here.
admin.site.register(Category)
admin.site.register(Listing)
admin.site.register(Watchlist)
admin.site.register(User_Comment)
admin.site.register(Bid)