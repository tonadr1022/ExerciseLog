from django.urls import path
from .views import CustomUserCreate, CurrentUserDetailView, BlacklistTokenView

app_name = 'users'

urlpatterns = [
    path('register/', CustomUserCreate.as_view(), name='create_user'),
    path('current-user/', CurrentUserDetailView.as_view(), name="current_user"),
    path('logout/blacklist/', BlacklistTokenView.as_view(), name='blacklist')

]
