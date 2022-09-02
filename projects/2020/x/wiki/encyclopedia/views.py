from cProfile import label
from turtle import title
from webbrowser import get
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django import forms


from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, entry):
    return render(request, "encyclopedia/entry.html", {
        "entry": util.get_entry(entry),
        "title": entry
    })

def search(request):
    search = request.GET.get('q')
    matches = []
    # exact match
    if util.get_entry(search):
        return redirect(f"/{search}")
    # checking substring
    for entry in util.list_entries():
        if search.upper() in entry.upper():
            matches.append(entry)
    if len(matches) > 0:
        return render(request, "encyclopedia/search_res.html", {
            "entries": matches
        })
    else:
        return render(request, "encyclopedia/search_res.html", {
            "fail": "No matches found"
        })

def create(request):
    print(f"fuuuuuuck {request.method}")
    if request.method == "GET":
        return render(request, "encyclopedia/create.html", {
            "form":newEntry()
        })
    elif request.method == "POST":
        form = newEntry(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            description = form.cleaned_data["description"]
            print(f"here's your form title '{title}' and description '{description}'")
        else:
            return HttpResponse(f"Your statement about the form being valid is {form.is_valid()}")
    return HttpResponse("YOU SUCK!")


class newEntry(forms.Form):
    title = forms.CharField(label="title")
    description = forms.CharField(label="description", widget=forms.Textarea())


