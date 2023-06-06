from django.db import models
import datetime
from django.utils import timezone
from datetimeutc.fields import DateTimeUTCField
from django.conf import settings


def upload_to(instance, filename):
    return f'images/user_{instance.user.id}/{filename}'


def calculatePace(distance, duration):
    pace = (duration.seconds) / (distance * 60)
    return pace


WORKOUT_TYPE_CHOICES = [
    ("Standard", 'Standard'),
    ("Long", 'Long'),
    ("Workout", 'Workout'),
    ("Race", 'Race'),
]
ACTIVITY_TYPE_CHOICES = [
    ('Run', "Run"),
    ('Bike', "Bike"),
    ("Swim", "Swim"),
    ("Elliptical", "Elliptical"),
    ("Walk", "Walk"),
    ('Cross Country Ski', 'Cross Country Ski'),
    ('Alpine Ski', 'Alpine Ski')
]


class Map(models.Model):
    id = models.CharField(
        primary_key=True, max_length=255)
    polyline = models.TextField(blank=True, null=True)
    resource_state = models.IntegerField(blank=True, null=True)
    summary_polyline = models.TextField(blank=True, null=True)
    exercise = models.OneToOneField(
        "Exercise", blank=True, null=True, on_delete=models.CASCADE, related_name='maps')


class Shoe(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True, editable=False, null=False, blank=False
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shoes')
    is_public = models.BooleanField(default=True)
    nickname = models.CharField(
        max_length=50, null=True, blank=True,)
    brand = models.CharField(max_length=50, null=False, blank=False)
    model = models.CharField(max_length=50, null=False, blank=False)
    notes = models.TextField(max_length=1000, null=True, blank=True)
    distance_run = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, null=False, blank=False)
    image = models.ImageField(upload_to=upload_to, null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.nickname} {self.distance_run}'

    def save(self, *args, **kwargs):
        if self.nickname is None:
            self.nickname = f'{self.brand} {self.model}'
        super().save(*args, **kwargs)


class WeatherInstance(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='weather')
    temperature = models.DecimalField(
        null=True, max_digits=5, decimal_places=2)
    humidity = models.PositiveSmallIntegerField(blank=True, null=True)
    feels_like = models.DecimalField(
        blank=True, null=True, max_digits=5, decimal_places=2)
    wind_speed = models.DecimalField(
        blank=True, null=True, max_digits=10, decimal_places=2)
    datetime = models.DateTimeField(default=timezone.now)
    from_current_api = models.BooleanField(null=True, blank=True)
    type = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        ordering = ["-datetime"]


class Exercise(models.Model):
    workout_type = models.CharField(max_length=8,
                                    choices=WORKOUT_TYPE_CHOICES)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='exercises')
    is_public = models.BooleanField(default=True)
    created_at = DateTimeUTCField(
        auto_now_add=True, editable=False, null=False, blank=False
    )
    updated_at = DateTimeUTCField(auto_now=True)
    weather = models.ForeignKey(
        WeatherInstance, on_delete=models.CASCADE, related_name='exercise', default=None, null=True, blank=True, editable=False)
    shoe = models.ForeignKey(
        Shoe, on_delete=models.SET_NULL, blank=True, null=True, related_name='exercises')
    map = models.OneToOneField(
        'Map', on_delete=models.CASCADE, blank=True, null=True, related_name='exercises')
    name = models.CharField(max_length=100, default="Activity")
    act_type = models.CharField(
        max_length=30, choices=ACTIVITY_TYPE_CHOICES, default='Run')
    datetime_started = DateTimeUTCField(
        null=True, blank=True, default=timezone.now)
    duration = models.DurationField(
        default=datetime.timedelta(minutes=0), null=True, blank=True)
    distance = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True)
    pace = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True)
    rating = models.PositiveSmallIntegerField(blank=True, null=True)
    notes = models.TextField(max_length=1000, blank=True, null=True)
    log_notes = models.TextField(max_length=1000, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    average_heartrate = models.DecimalField(
        blank=True, null=True, decimal_places=1, max_digits=10)
    max_heartrate = models.DecimalField(
        blank=True, null=True, decimal_places=1, max_digits=10)
    total_elevation_gain = models.DecimalField(
        blank=True, null=True, decimal_places=1, max_digits=10)
    strava_id = models.CharField(blank=True, null=True, max_length=100)
    calories = models.DecimalField(
        blank=True, null=True, decimal_places=1, max_digits=10)

    class Meta:
        ordering = ["-datetime_started"]

    def save(self, *args, **kwargs):
        original_distance = 0
        if self.pk:
            original_exercise = Exercise.objects.get(pk=self.pk)
            original_distance = original_exercise.distance

        if self.shoe and self.distance:
            shoe = Shoe.objects.get(id=self.shoe.id)
            if shoe.distance_run and self.distance:
                shoe.distance_run += self.distance
                shoe.distance_run -= original_distance
                shoe.save()

        if self.duration == datetime.timedelta(minutes=0):
            self.duration = None
        if None not in [self.distance, self.duration]:
            self.pace = calculatePace(self.distance, self.duration)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}, {self.created_at}"
