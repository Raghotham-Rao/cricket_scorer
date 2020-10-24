from django.db import models
from django.contrib.auth.models import User

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