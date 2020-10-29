from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse,HttpResponseServerError
from . import forms,models
from .models import Match
import json

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


@login_required(login_url='/login/')
def track_match(request):
    form = forms.MatchForm()
    player_pool = models.Player.objects.all().filter(pool_admin=request.user)
    return render(request, 'track_match.html', {'match_form': form, 'player_pool': player_pool})


@login_required(login_url='/login/')
def match_details(request):
    match = Match()
    form = request.POST
    match.overs_per_team = form["overs_per_team"][0]
    match.players_per_team = form["players_per_team"][0]
    match.toss_won_by = form['toss_won_by'][0]
    match.batting_first = form['batting_first'][0]
    match.pool_admin = request.user
    match.result = 'In Progress'
    # match.save()
    try:
        match.save()
        return HttpResponse("success")
    except:
        return HttpResponseServerError("unable to update")