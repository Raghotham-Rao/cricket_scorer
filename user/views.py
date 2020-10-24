from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from . import forms,models

# Create your views here.
@login_required(login_url='/login/')
def index(request):
    no_of_players = models.Player.objects.all().filter(pool_admin=request.user)
    return render(request, "dashboard.html", {'no_of_players': len(no_of_players)})

@login_required(login_url='/login/')
def player_pool(request):
    form = forms.AddPlayerForm()
    players = models.Player.objects.all().filter(pool_admin=request.user)
    return render(request, 'player_pool.html', {"form": form, 'players': players})

@login_required(login_url='/login/')
def add_player(request):
    if request.method == 'POST':
        form = forms.AddPlayerForm(request.POST)
        if form.is_valid():
            player = form.save(commit=False)
            player.pool_admin = request.user
            player.save()
            return redirect('user:player_pool')
        else:
            form = forms.AddPlayerForm()
    return redirect('user:player_pool')
    # form.save()