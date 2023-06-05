from django.urls import path
from . import views

app_name = 'strava'

urlpatterns = [
    path('webhook/', views.StravaWebhookView.as_view()),
    path('authorization/', views.StravaAuthorizationView.as_view()),
    path('webhook-subscribe/', views.StravaWebhookSubscriptionView.as_view()),
]
