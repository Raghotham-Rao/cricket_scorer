from django.urls import path
from . import views

app_name = 'user'

urlpatterns = [
    path('', views.index, name="dashboard"),
    path('player_pool/', views.player_pool, name="player_pool"),
    path('add_player/', views.add_player, name="add_player"),
    path('track_match/<int:match_id>/', views.tracker, name="track_match"),
    path('match_details/', views.match_details, name="match_details"),
    path('tracked_matches/', views.tracked_matches, name="tracked_matches"),
    path('update_score/', views.update_score, name="update_score"),
    path('player_profile/<int:player_id>/', views.player_profile, name="player_profile"),
    path('end_match/<int:match_id>/', views.end_match, name="end_match"),
    path('match_stats/<int:match_id>/', views.match_stats, name="match_stats"),
    path('undo/<int:match_id>/', views.undo, name="undo"),
]