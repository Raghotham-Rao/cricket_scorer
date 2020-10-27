from django.urls import path
from . import views

app_name = 'user'

urlpatterns = [
    path('', views.index, name="dashboard"),
    path('player_pool/', views.player_pool, name="player_pool"),
    path('add_player/', views.add_player, name="add_player"),
    path('track_match/', views.track_match, name="track"),
]