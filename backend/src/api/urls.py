from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'api'

# urlpatterns = [
#     path('exercises/', views.ExerciseListView.as_view()),
#     path('exercises/<int:pk>', views.ExerciseDetailView.as_view()),
#     path('weather/', views.WeatherInstanceListView.as_view()),
#     path('shoes/', views.ShoeListView.as_view()),
#     path('shoes/<int:pk>', views.ShoeDetailView.as_view()),
# ]

router = DefaultRouter()
router.register(r'user-exercises', views.ExerciseViewSet,
                basename='user-exercise')
router.register(r'user-shoes', views.ShoeViewSet, basename='user-shoe')

urlpatterns = [
    path('user-weather/', views.WeatherInstanceListView.as_view()),
    path('exercises/', views.ExercisesAllUsersListView.as_view()),
    path('shoes/', views.ShoesAllUsersListView.as_view()),
    path('summary/', views.ExerciseRangeView.as_view()),
    path('stats/', views.StatisticsView.as_view()),
    path('import-strava/', views.ImportStravaActivitiesView.as_view()),
    path('', include(router.urls)),
]
