from django.contrib import admin

from .models import Category, Listing, Watch_list, Comment, Bid

# Register your models here.
admin.site.register(Category)
admin.site.register(Listing)
admin.site.register(Watch_list)
admin.site.register(Comment)
admin.site.register(Bid)