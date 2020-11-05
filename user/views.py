from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse,HttpResponseServerError
from . import forms,models
from .models import Match
import json
from django.db.models import Sum

# Create your views here.
@login_required(login_url='/login/')
def index(request):
    no_of_players = models.Player.objects.all().filter(pool_admin=request.user).count()
    no_of_matches = models.Match.objects.all().filter(pool_admin=request.user).count()
    return render(request, "user/dashboard.html", {'no_of_players': no_of_players, 'no_of_matches': no_of_matches})

@login_required(login_url='/login/')
def player_pool(request):
    form = forms.AddPlayerForm()
    players = models.Player.objects.all().filter(pool_admin=request.user)
    return render(request, 'user/player_pool.html', {"form": form, 'players': players})


@login_required(login_url='/login/')
def tracked_matches(request):
    matches = models.Match.objects.all().filter(pool_admin=request.user)
    return render(request, 'user/matches_tracked.html', {'matches_tracked': matches})


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
def match_details(request):
    if request.method == 'POST':
        form = forms.MatchForm(request.POST)
        if form.is_valid():
            match = form.save(commit=False)
            match.pool_admin = request.user
            match.result = 'In Progress'
            match.save()
            return redirect('user:track_match', match_id=match.id)
        else:
            return render(request, 'user/add_match_details.html', {'match_form': form})
    else:
        form = forms.MatchForm()
        return render(request, 'user/add_match_details.html', {'match_form': form})


@login_required(login_url='/login/')
def tracker(request, match_id):
    player_pool = models.Player.objects.all().filter(pool_admin=request.user)
    balls = models.ByBallStat.objects.all().filter(match_id=match_id)
    status = 'new' if balls.count() == 0 else 'old'
    resp_data = dict()
    resp_data['team1_over'] = 0
    resp_data['team1_ball'] = 0
    resp_data['team2_over'] = 0
    resp_data['team2_ball'] = 0
    if status == 'old':
        resp_data['strike'] = balls.last().strike
        resp_data['non_strike'] = balls.last().non_strike
        resp_data['bowler'] = balls.last().bowler
        resp_data['inning'] = balls.last().inning
        resp_data['team1_over'] = balls.filter(inning=1).last().over
        resp_data['team1_ball'] = balls.filter(inning=1).last().ball
        if resp_data['inning'] == 2:
            resp_data['team2_over'] = balls.filter(inning=2).last().over
            resp_data['team2_ball'] = balls.filter(inning=2).last().ball
        resp_data['team1_score'] = balls.filter(inning=1).aggregate(Sum('total_runs'))['total_runs__sum']
        resp_data['team2_score'] = balls.filter(inning=2).aggregate(Sum('total_runs'))['total_runs__sum']
        resp_data['team1_wickets'] = balls.filter(inning=1).exclude(player_dismissed="").count()
        resp_data['team2_wickets'] = balls.filter(inning=2).exclude(player_dismissed="").count()
        for key in ['team1_score', 'team2_score', 'team2_wickets', 'team1_wickets']:
            resp_data[key] = 0 if resp_data[key] is None else resp_data[key]
    resp_data['match_length'] = models.Match.objects.filter(id=match_id).first().overs_per_team
    resp_data['match_players'] = models.Match.objects.filter(id=match_id).first().players_per_team
    resp_data['player_pool'] = player_pool
    resp_data['match_id'] = match_id
    resp_data['status'] = status
    print(resp_data)
    # return HttpResponse(resp_data)
    return render(request, 'user/track_match.html/', resp_data)


@login_required(login_url='/login/')
def update_score(request):
    form = request.POST
    ball = models.ByBallStat()
    ball.match_id = models.Match.objects.all().filter(id=form.get('match_id'))[0]
    ball.inning = form.get('inning')
    ball.over = form.get('over')
    ball.ball = form.get('ball')
    ball.strike = form.get('strike')
    ball.non_strike = form.get('non_strike')
    ball.bowler = form.get('bowler')
    ball.is_wide = form.get('is_wide') == 'true'
    ball.is_no_ball = form.get('is_no_ball') == 'true'
    ball.batsman_runs = form.get('batsman_runs')
    ball.total_runs = form.get('total_runs')
    ball.player_dismissed = form.get('player_dismissed')
    ball.dismissal_kind = form.get('dismissal_kind')
    ball.fielder = form.get('fielder')
    ball.save()
    return HttpResponse("success")