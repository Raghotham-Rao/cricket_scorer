from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse,HttpResponseServerError
from . import forms,models
from .models import Match
import json
from django.db.models import Sum, Count

# Create your views here.
@login_required(login_url='/login/')
def index(request):
    no_of_players = models.Player.objects.all().filter(pool_admin=request.user).count()
    no_of_matches = models.Match.objects.all().filter(pool_admin=request.user).count()
    return render(request, "user/dashboard.html", {'no_of_players': no_of_players, 'no_of_matches': no_of_matches})

@login_required(login_url='/login/')
def player_pool(request):
    form = forms.AddPlayerForm()
    players = models.Player.objects.all().filter(pool_admin=request.user).order_by('name')
    names = [i['name'] for i in players.values('name')]
    player_profiles = {player.name: {'id': player.id, 'name': player.name, 'role': player.role, 'innings': 0, 'bat_style': player.bat_style, 'bowl_style': player.bowl_style, 'runs': 0, 'balls_faced': 0, 'wickets': 0, 'balls_bowled': 0} for player in players}

    for row in models.ByBallStat.objects.values('strike').annotate(Sum('batsman_runs')):
        player_profiles[row['strike']]['runs'] = row['batsman_runs__sum'] 

    for row in models.ByBallStat.objects.values('strike').annotate(Count('batsman_runs')):
        player_profiles[row['strike']]['balls_faced'] = row['batsman_runs__count']

    for row in models.ByBallStat.objects.values('strike').annotate(Count('match_id', distinct=True)):
        player_profiles[row['strike']]['innings'] = row['match_id__count']
    
    for row in models.ByBallStat.objects.exclude(player_dismissed="").values('bowler').annotate(Count('player_dismissed')):
        player_profiles[row['bowler']]['wickets'] = row['player_dismissed__count']

    for row in models.ByBallStat.objects.values('bowler').annotate(Count('ball_id')):
        player_profiles[row['bowler']]['balls_bowled'] = row['ball_id__count']

    for row in models.ByBallStat.objects.values('bowler').annotate(Sum('total_runs')):
        player_profiles[row['bowler']]['runs_conceded'] = row['total_runs__sum']

    player_profiles = [player_profiles[name] for name in player_profiles]

    highest_run_scorer = sorted(player_profiles, key=lambda x: x['runs'], reverse=True)[0]
    highest_wicket_taker = sorted(player_profiles, key=lambda x: x['wickets'], reverse=True)[0]

    for d in player_profiles:
        d['strike_rate'] = round(d['runs'] * 100 / d['balls_faced'], 2) if d['balls_faced'] > 0 else 0.0
        d['economy'] = round(d['runs_conceded'] / (d['balls_bowled'] / 6), 2) if d['balls_bowled'] > 0 else 0.0

    best_strike_rate = sorted(player_profiles, key=lambda x: x['strike_rate'], reverse=True)[0]
    best_economy = sorted(player_profiles, key=lambda x: x['economy'] if x['economy'] > 0 else 36)[0]
    
    return render(request, 'user/player_pool.html', 
    {
        "player_count": players.count(), 
        'profiles': player_profiles, 
        "form": form, 
        "highest_run_scorer": highest_run_scorer,
        "highest_wicket_taker": highest_wicket_taker,
        "best_strike_rate": best_strike_rate,
        "best_economy": best_economy
    })


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

@login_required(login_url="/login/")
def player_profile(request, player_id):
    player_name = models.Player.objects.filter(pool_admin=request.user, id=player_id).values_list('name', flat=True)[0]
    matches = models.Match.objects.filter(pool_admin=request.user).values_list('id', flat=True)
    all_balls_faced = models.ByBallStat.objects.filter(strike=player_name).all()
    runs_scored_per_match = list(map(lambda x: str(x['batsman_runs__sum']), all_balls_faced.values('match_id').annotate(Sum('batsman_runs'))))
    run_distribution = []
    for i in range(7):
        run_distribution.append(str(all_balls_faced.filter(batsman_runs=i).count()))
    run_distribution = ', '.join(run_distribution)

    total_runs = sum(all_balls_faced.values_list('batsman_runs', flat=True))
    out_times = models.ByBallStat.objects.filter(player_dismissed='player_name').values_list('ball_id', flat=True).count()
    average = round(total_runs / out_times, 2) if out_times > 0 else 'na'
    strike_rate = round(total_runs * 100 / all_balls_faced.count(), 2) if all_balls_faced.count() > 0 else 0.0

    all_balls_bowled = models.ByBallStat.objects.filter(bowler=player_name).all()
    runs_conceded_per_match = [i['total_runs__sum'] for i in all_balls_bowled.values('match_id').annotate(Sum('total_runs'))]
    legal_balls_per_macth = all_balls_bowled.exclude(is_wide=True, is_no_ball=True).values('match_id').annotate(Count('ball_id')).values_list('ball_id__count', flat=True)
    economy = 'na'
    overall_economy = 0.0
    if len(legal_balls_per_macth) > 0:
        economy = []
        for i in range(len(runs_conceded_per_match)):
            try:
                economy.append(round(runs_conceded_per_match[i] / (legal_balls_per_macth[i] / 6), 2))
            except:
                economy.append(0)

        overall_economy = round(sum(runs_conceded_per_match) / (sum(legal_balls_per_macth) / 6), 2)
            
    # return HttpResponse(all_balls_faced.filter(batsman_runs=0).count())
    data = {
        'name': player_name,
        'runs_scored_per_match': ', '.join(runs_scored_per_match), 
        'run_distribution': run_distribution, 
        'total_runs': total_runs, 
        'average': average,
        'strike_rate': strike_rate,
        'high_score': max([int(i) for i in runs_scored_per_match]) if len(runs_scored_per_match) > 0 else 'na',
        'fours': all_balls_faced.filter(batsman_runs=4).count,
        'sixes': all_balls_faced.filter(batsman_runs=6).count,
        'economy': ', '.join(list(map(str, economy))),
        'overall_economy': overall_economy,
    }
    return render(request, 'user/player_profile.html', data)


@login_required(login_url="/login/")
def match_stats(request, match_id):
    match_balls = models.ByBallStat.objects.filter(match_id=match_id).all()
    innings_1 = list(match_balls.filter(inning=1).values_list('total_runs', flat=True))
    innings_2 = list(match_balls.filter(inning=2).values_list('total_runs', flat=True))
    for i in range(1, len(innings_1)):
        innings_1[i] += innings_1[i-1]
    for i in range(1, len(innings_2)):
        innings_2[i] += innings_2[i-1]
    data = {
        'innings1_runs': ', '.join(list(map(str, innings_1))),
        'innings2_runs': ', '.join(list(map(str, innings_2))),
    }
    return render(request, 'user/match_stats.html', data)


@login_required(login_url="/login/")
def end_match(request, match_id):
    match = models.Match.objects.filter(id=match_id)[0]
    match.result = "Completed"
    match.save()
    return redirect('user:match_stats', match_id=match_id)