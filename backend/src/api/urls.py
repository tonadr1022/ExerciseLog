from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    path('exercises/', views.ExerciseListView.as_view(), name='detailcreate'),
    path('exercises/<int:pk>', views.ExerciseDetailView.as_view(), name='postcreate'),
]
