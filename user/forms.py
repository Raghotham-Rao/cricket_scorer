from django import forms
from . import models


class AddPlayerForm(forms.ModelForm):
    class Meta:
        model = models.Player
        fields = ['name', 'role', 'bat_style', 'bowl_style']
        