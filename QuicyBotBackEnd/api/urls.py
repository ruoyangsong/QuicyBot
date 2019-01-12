from django.urls import path

from . import views

app_name = 'api'

urlpatterns = [
    path('post/', views.post, name='post'),
    path('', views.index),

]