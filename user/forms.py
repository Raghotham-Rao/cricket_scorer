from django import forms
from . import models


class AddPlayerForm(forms.ModelForm):
    class Meta:
        model = models.Player
        fields = ['name', 'role', 'bat_style', 'bowl_style']


class MatchForm(forms.ModelForm):
    class Meta:
        model = models.Match
        fields = ['overs_per_team', 'players_per_team', 'toss_won_by', 'batting_first']