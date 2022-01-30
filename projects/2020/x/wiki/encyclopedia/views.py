from django.shortcuts import render
from django.http import HttpResponse
from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, entry):
    # return HttpResponse(f"Hello {entry}")
    content = util.get_entry(entry)
    if content:
        return render(request, f"encyclopedia/entry.html", {
            "content": content,
            "title": entry.capitalize()
        })
    else:
        return render(request, "encyclopedia/no-entry.html", {
            "title": entry.capitalize()
        })
