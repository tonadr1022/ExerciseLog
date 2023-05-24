from django.db import models
import requests
from requests import HTTPError
import datetime
from django.utils import timezone
from pathlib import Path
import os
import environ
from django.contrib.auth.models import User

env = environ.Env()
BASE_DIR = Path(__file__).resolve().parent.parent.parent
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

TYPE_CHOICES = [
    ("Run", "Run"),
    ("Bike", "Bike"),
    ("Swim", "Swim"),
    ("Elliptical", "Elliptical"),
    ("Walk", "Walk"),
]


def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)


class Shoe(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True, editable=False, null=False, blank=False
    )
    nickname = models.CharField(max_length=50, null=True, blank=True)
    brand = models.CharField(max_length=50, null=False, blank=False)
    model = models.CharField(max_length=50, null=False, blank=False)
    notes = models.TextField(max_length=1000, null=True, blank=True)
    distance_run = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, null=False, blank=False)
    image_url = models.ImageField(upload_to=upload_to, null=True, blank=True)

    def __str__(self) -> str:
        return self.nickname

    def save(self, *args, **kwargs):
        if self.nickname is None:
            self.nickname = f'{self.brand} {self.model}'
        super().save(*args, **kwargs)


class WeatherInstance(models.Model):
    temperature = models.DecimalField(
        null=True, max_digits=5, decimal_places=2)
    humidity = models.PositiveSmallIntegerField(blank=True, null=True)
    feels_like = models.DecimalField(
        blank=True, null=True, max_digits=5, decimal_places=2)
    datetime = models.DateTimeField(default=timezone.now)


class Exercise(models.Model):
    # weather = models.OneToOneField(WeatherInstance, on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='exercises')
    created_at = models.DateTimeField(
        auto_now_add=True, editable=False, null=False, blank=False
    )
    weather = models.ForeignKey(
        WeatherInstance, on_delete=models.CASCADE, related_name='exercise', null=True, blank=True)
    shoe = models.ForeignKey(
        Shoe, on_delete=models.SET_NULL, null=True, related_name='exercises')
    name = models.CharField(max_length=100, default="Activity")
    act_type = models.CharField(
        max_length=30, choices=TYPE_CHOICES, default="Run")
    datetime_started = models.DateTimeField(
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
    # temperature = models.DecimalField(
    #     blank=True, null=True, max_digits=5, decimal_places=2
    # )
    # humidity = models.PositiveSmallIntegerField(blank=True, null=True)
    # feels_like = models.DecimalField(
    #     blank=True, null=True, max_digits=5, decimal_places=2
    # )

    class Meta:
        ordering = ["-created_at"]

    def get_formatted_loc_from_coords(self, lat, lng):
        params = {'latlng': f'{lat},{lng}',
                  'key': env("GEOLOCATE_API_KEY")}
        url = env('GEOLOCATE_INPUT_URL')
        try:
            r = requests.get(url, params=params)
            r.raise_for_status()
            resp_json = r.json()
        except HTTPError as e:
            return 'error'
        formatted_loc = ' '.join(resp_json['plus_code']
                                 ['compound_code'].split(' ')[-3:])
        return formatted_loc

    def get_location(self):
        geolocate_api_key = env('GEOLOCATE_API_KEY')
        if self.location is None:
            # get current location coordinates from Google geolocation API
            params = {"key": geolocate_api_key}
            location_url = env('GEOLOCATE_CURRENT_URL')
            try:
                r = requests.post(location_url, params=params)
                r.raise_for_status()

            except HTTPError as e:
                return None

            json_data = r.json()
            lat = str(json_data["location"]["lat"])
            lng = str(json_data["location"]["lng"])

        else:
            # get coordinates from location input
            url = env("GEOLOCATE_INPUT_URL")
            params = {"sensor": "false",
                      "address": self.location, "key": geolocate_api_key}
            try:
                r = requests.get(url, params=params)
                location = r.json()
            except HTTPError as e:
                return None

            lat = str(location["results"][0]["geometry"]["location"]["lat"])
            lng = str(location["results"][0]["geometry"]["location"]["lng"])

        formatted_loc = self.get_formatted_loc_from_coords(lat, lng)
        return {"lat": lat, "lng": lng, 'formatted_loc': formatted_loc}

    def get_weather_from_coordinates(self, location):
        print("time" + str(timezone.now))
        # get coordinates from input dictionary
        lat = location["lat"]
        lng = location["lng"]

        # get the time 2.5 hrs ago
        timeThreshold = timezone.now() - datetime.timedelta(hours=2, minutes=30)
        # if the string of the difference in time is negative, input time was less than 2.5 hrs ago
        # then get current weather. Otherwise, use the input time for weather history
        if str(self.datetime_started - timeThreshold)[0] != "-":
            params = {
                "lat": lat,
                "lon": lng,
                "appid": env("WEATHER_API_KEY"),
            }
            url = env("CURR_WEATHER_URL")
            r = requests.get(url, params=params)
            r.raise_for_status()

            currWeather = r.json()
            temp = round(
                (currWeather["main"]["temp"] - 273.15) * 9 / 5 + 32, 2)
            feelsLike = round(
                (currWeather["main"]["feels_like"] - 273.15) * 9 / 5 + 32, 2
            )
            humidity = currWeather["main"]["humidity"]

            weatherDict = {"temp": temp,
                           "feelsLike": feelsLike, "humidity": humidity}
            return weatherDict
        else:
            # need to use timestamp of datetime
            time = self.datetime_started.timestamp()
            weatherParams = {
                "lat": lat,
                "lon": lng,
                "start": time,
                "cnt": 1,
                "appid": env("WEATHER_API_KEY"),
            }
            weatherURL = env("HIST_WEATHER_URL")
            r = requests.get(weatherURL, params=weatherParams)
            r.raise_for_status()
            weatherJSON = r.json()
            print(weatherJSON)
            temp = round(
                (weatherJSON["list"][0]["main"]
                 ["temp"] - 273.15) * 9 / 5 + 32, 2
            )
            feelsLike = round(
                (weatherJSON["list"][0]["main"]
                 ["feels_like"] - 273.15) * 9 / 5 + 32, 2
            )
            humidity = weatherJSON["list"][0]["main"]["humidity"]

            return {"temp": temp,
                    "feelsLike": feelsLike, "humidity": humidity}

    def calculatePace(self):
        pace = (self.duration.seconds) / (self.distance * 60)
        return pace

    def save(self, *args, **kwargs):
        location = self.get_location()
        self.location = location['formatted_loc']
        weather = self.get_weather_from_coordinates(location)
        self.temperature = weather["temp"]
        self.feelsLike = weather["feelsLike"]
        self.humidity = weather["humidity"]
        if self.duration == datetime.timedelta(minutes=0):
            self.duration = None
        if None not in [self.distance, self.duration]:
            self.pace = self.calculatePace()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}, {self.created_at}"
