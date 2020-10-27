from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class Player(models.Model):
    roles = [
        ('Batsman', 'Batsman'),
        ('Bowler', 'Bowler'),
        ('All Rounder', 'All Rounder')
    ]
    styles = [
        ('RHB', 'RHB - Right Handed'),
        ('LHB', 'LHB - Left Handed')
    ]
    name = models.CharField(max_length=50)
    role = models.CharField(max_length=20, choices=roles, default='All Rounder')
    bat_style = models.CharField(max_length=20, choices=styles, default='RHB')
    bowl_style = models.CharField(max_length=20, choices=styles, default='RHB')
    matches = models.IntegerField(default=0)
    runs = models.IntegerField(default=0)
    strike_rate = models.FloatField(default=0.0)
    overs = models.FloatField(default=0.0)
    wickets = models.IntegerField(default=0)
    economy = models.FloatField(default=0.0)
    pool_admin = models.ForeignKey(User, on_delete=models.CASCADE, default=None)


class Match(models.Model):
    team_select = [
        ('team1', 'Team 1'),
        ('team2', 'Team 2')
    ]
    overs_per_team = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(50)
        ]
    )
    players_per_team = models.IntegerField(
        validators=[
            MinValueValidator(2),
            MaxValueValidator(15)
        ]
    )
    toss_won_by = models.CharField(choices=team_select, default='team1', max_length=10)
    batting_first = models.CharField(choices=team_select, default='team1', max_length=10)
    team1_score = models.IntegerField()
    team2_score = models.IntegerField()
    result = models.CharField(max_length=30)
    pool_admin = models.ForeignKey(User, default=None, on_delete=models.CASCADE)


# class Stat(models.Model):
#     # 