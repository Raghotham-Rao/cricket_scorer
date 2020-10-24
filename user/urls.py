from django.urls import path
from . import views

app_name = 'user'

urlpatterns = [
    path('', views.index, name="dashboard"),
    path('player_pool/', views.player_pool, name="player_pool")
]