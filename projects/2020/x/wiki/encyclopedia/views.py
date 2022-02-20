from cProfile import label
from curses.ascii import HT
from pickletools import read_uint1
import re
from django.shortcuts import redirect, render
from django.http import HttpResponse
from django import forms
from random import randrange
from . import util

# declare a form class for search
class NewSearchForm(forms.Form):
    query = forms.CharField(label="query")


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
        "form": NewSearchForm()
    })

def entry(request, title):
    # return HttpResponse(f"Hello {entry}")
    if request.method == 'GET':
        content = util.get_entry(title)
        if content:
            return render(request, f"encyclopedia/entry.html", {
                "content": content,
                "title": title.capitalize(),
                "form": NewSearchForm()
            })
        else:
            return render(request, "encyclopedia/no-entry.html", {
                "title": title.capitalize(),
                "form": NewSearchForm()
            })
    else:
        return HttpResponse("hello mate - this is an http response")

def search(request):
    input = NewSearchForm(request.GET)
    if input.is_valid():
        input = input.cleaned_data["query"].casefold()
        if util.get_entry(input):
            return redirect(f"wiki/{input}")
        else:
            # look for substrings of {input} in all entries and return list of matching entries
            entries = util.list_entries()
            matches = []
            for title in entries:
                if input in title.casefold():
                    matches.append(title)
            if matches:
                return render(request, "encyclopedia/search.html", {
                    "entries": matches,
                    "form": NewSearchForm()
                    })
            else:
                return HttpResponse("NO MATCHES")
    else:
        return HttpResponse("Invalid form!")

def add(request):
    # declare a form class for title of new page
    class CreateEntryForm(forms.Form):
        title = forms.CharField(label="title")
        content = forms.CharField(widget=forms.Textarea, label="content")

    if request.method == 'GET':
        return render(request, "encyclopedia/add.html", {
            "form": NewSearchForm(),
            "entryForm": CreateEntryForm()
        })
    else:
        # get the form data...
        newEntry = CreateEntryForm(request.POST)
        if newEntry.is_valid():
            title = newEntry.cleaned_data["title"]
            content = newEntry.cleaned_data["content"]
            if util.get_entry(title):
                return HttpResponse("This page already exists")
            util.save_entry(title, content)
            return redirect(f"wiki/{title}")
        else:
            return HttpResponse("form not valid")

def edit(request, title):
    class textArea(forms.Form):
            area = forms.CharField(widget=forms.Textarea, label="Content")
    
    if request.method == "GET":
        content = util.get_entry(title)

        return render(request, "encyclopedia/edit.html", {
                "form": NewSearchForm(),
                "textArea": textArea({"area":content}),
                "title":title
            })
    else:
        # TODO change the body of the entry, but not the title
        content = textArea(request.POST)
        if content.is_valid():
            content = content.cleaned_data["area"]
            print(f"Title is : {title}, and content is {content}")
            util.save_entry(title, content)
            return redirect(f"../wiki/{title}")
        else:
            return HttpResponse("form input invalid")
    
def random(request):
    # get length of list
    entries = util. list_entries()
    print(f"THE ENTRIES ARE : {entries}")
    i = len(entries)
    x = randrange(i)
    print (f"X IS : {x}")
    rdmNtry = entries[x]
    return redirect(f"../wiki/{rdmNtry}")
