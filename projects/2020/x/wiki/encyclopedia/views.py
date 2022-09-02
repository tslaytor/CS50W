from cProfile import label
from turtle import title
from webbrowser import get
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django import forms
import random
import markdown2


from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, entry):
    if not util.get_entry(entry):
        return HttpResponse("ERROR: No results found")
    return render(request, "encyclopedia/entry.html", {
        "entry": markdown2.markdown(util.get_entry(entry)),
        "title": entry
    })

def search(request):
    search = request.GET.get('q')
    matches = []
    # exact match
    if util.get_entry(search):
        return redirect(f"../wiki/{search}")
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
    if request.method == "GET":
        return render(request, "encyclopedia/create.html", {
            "form":newEntry()
        })
    elif request.method == "POST":
        form = newEntry(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            content = form.cleaned_data["content"]
            # if title already in entries, return an error message
            if util.get_entry(title):
                return HttpResponse("This entry alrady exists, error error error")
            #  save the entry and redirect to the new entry's page
            util.save_entry(title, content)
            return redirect(f"../wiki/{title}")
        else:
            return HttpResponse(f"ERROR: your form had invalid input")
    return HttpResponse("ERROR: Didn't recognise the request method")

def edit(request, title):
    entry = util.get_entry(title)
    print(f"PRINTING!!! {entry}")
    if request.method == "GET":
        return render(request, "encyclopedia/edit.html", {
            "form":editForm({'content': entry}),
            "title": title
        })
    elif request.method == "POST":
        util.save_entry(title, request.POST.get('content'))
        return redirect(f"../wiki/{title}")
    # return HttpResponse(f"edit path for {title}")

def rand (request):
    list = util.list_entries()
    r = random.randrange(0, len(list))
    return redirect(f'../wiki/{list[r]}')

class newEntry(forms.Form):
    title = forms.CharField(label="title")
    content = forms.CharField(label="description", widget=forms.Textarea())

class editForm(forms.Form):
    content = forms.CharField(label="description", widget=forms.Textarea())
