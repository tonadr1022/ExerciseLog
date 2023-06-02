from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class CustomAccountManager(BaseUserManager):
    def create_superuser(self, email, user_name, first_name, last_name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_active', True)
        other_fields.setdefault('is_superuser', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError('Superuser must be assigned to is_staff=True')
        if other_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True')

        return self.create_user(email, user_name, first_name, last_name, password, **other_fields)

    def create_user(self, email, user_name, first_name, last_name, password, **other_fields):
        email = self.normalize_email(email)

        if not email:
            raise ValueError('You must provide valid email')

        user = self.model(email=email, user_name=user_name,
                          first_name=first_name, last_name=last_name, ** other_fields)
        user.set_password(password)
        user.save()
        return user


class NewUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    user_name = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    start_date = models.DateTimeField(default=timezone.now)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # Strava integration fields
    strava_authorized = models.BooleanField(default=False)
    strava_athlete_id = models.CharField(max_length=255, null=True, blank=True)
    strava_access_token = models.CharField(
        max_length=255, null=True, blank=True)
    strava_refresh_token = models.CharField(
        max_length=255, null=True, blank=True)
    strava_access_token_expiration = models.DateTimeField(
        blank=True, null=True)

    objects = CustomAccountManager()

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['user_name', 'first_name', 'last_name']
