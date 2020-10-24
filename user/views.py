from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from . import forms

# Create your views here.
@login_required(login_url='/login/')
def index(request):
    return render(request, "dashboard.html")

@login_required(login_url='/login/')
def player_pool(request):
    form = forms.AddPlayerForm()
    return render(request, 'player_pool.html', {"form": form})