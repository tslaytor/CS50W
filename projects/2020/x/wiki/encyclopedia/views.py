from pickletools import read_uint1
import re
from django.shortcuts import redirect, render
from django.http import HttpResponse
from django import forms
from . import util

class NewSearchForm(forms.Form):
    query = forms.CharField(label="query")

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
        "form": NewSearchForm()
    })

def entry(request, entry):
    # return HttpResponse(f"Hello {entry}")
    if request.method == 'GET':
        content = util.get_entry(entry)
        if content:
            return render(request, f"encyclopedia/entry.html", {
                "content": content,
                "title": entry.capitalize(),
                "form": NewSearchForm()
            })
        else:
            return render(request, "encyclopedia/no-entry.html", {
                "title": entry.capitalize(),
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