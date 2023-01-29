from django.shortcuts import render

# Create your views here.
def create(request):
    return render(request, 'drum_exercises/create.html')