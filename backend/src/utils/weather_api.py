import requests
from requests import HTTPError
import datetime
from django.utils import timezone
from pathlib import Path
import os
import environ

env = environ.Env()
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


def get_formatted_loc_from_coords(lat, lng):
    params = {'latlng': f'{lat},{lng}',
              'key': 'AIzaSyCfvzdIv-73cq8C8ilpG9BgFhH581_vl_Y'}
    url = 'https://maps.googleapis.com/maps/api/geocode/json'
    try:
        r = requests.get(url, params=params)
        r.raise_for_status()
        resp_json = r.json()
    except HTTPError as e:
        return None
    formatted_loc = ' '.join(resp_json['plus_code']
                             ['compound_code'].split(' ')[1:])
    return formatted_loc


def get_location(location):
    if location is None:
        # get current location coordinates from Google geolocation API
        params = {"key": 'AIzaSyCfvzdIv-73cq8C8ilpG9BgFhH581_vl_Y'}
        location_url = 'https://www.googleapis.com/geolocation/v1/geolocate'
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
        url = 'https://maps.googleapis.com/maps/api/geocode/json'
        params = {"sensor": "false",
                  "address": location, "key": 'AIzaSyCfvzdIv-73cq8C8ilpG9BgFhH581_vl_Y'}
        try:
            r = requests.get(url, params=params)
            location = r.json()
            if len(location['results']) == 0:
                print('no location')
                return None
        except HTTPError as e:
            return None

        lat = str(location["results"][0]["geometry"]["location"]["lat"])
        lng = str(location["results"][0]["geometry"]["location"]["lng"])

    formatted_loc = get_formatted_loc_from_coords(lat, lng)
    return {"lat": lat, "lng": lng, 'formatted_loc': formatted_loc}


def get_weather_from_coordinates(location, datetime_started):
    # get coordinates from input dictionary
    lat = location["lat"]
    lng = location["lng"]

    # get the time 2.5 hrs ago
    timeThreshold = timezone.now() - datetime.timedelta(hours=2, minutes=30)
    # if the string of the difference in time is negative, input time was less than 2.5 hrs ago
    # then get current weather. Otherwise, use the input time for weather history
    if str(datetime_started - timeThreshold)[0] != "-":
        params = {
            "lat": lat,
            "lon": lng,
            "appid": '917f3f80bdd3351fe1b4ee172ccd490b',
            "units": "imperial"
        }
        url = 'https://api.openweathermap.org/data/2.5/weather'
        r = requests.get(url, params=params)
        r.raise_for_status()

        currWeatherJSON = r.json()

        temperature = currWeatherJSON["main"]["temp"]
        feelsLike = currWeatherJSON["main"]["feels_like"]
        humidity = currWeatherJSON["main"]["humidity"]
        wind_speed = currWeatherJSON['wind']['speed']
        type = currWeatherJSON['weather'][0]['main']

        return {"temperature": temperature,
                "feels_like": feelsLike, "humidity": humidity, 'wind_speed': wind_speed, "from_current_api": True, "type": type}

    else:
        # need to use timestamp of datetime
        time = datetime_started.timestamp()
        weatherParams = {
            "lat": lat,
            "lon": lng,
            "start": time,
            "cnt": 1,
            "appid": '917f3f80bdd3351fe1b4ee172ccd490b',
            "units": "imperial"
        }
        weatherURL = 'https://history.openweathermap.org/data/2.5/history/city'
        r = requests.get(weatherURL, params=weatherParams)
        r.raise_for_status()
        oldWeatherJSON = r.json()

        temperature = oldWeatherJSON["list"][0]["main"]["temp"]
        feels_like = oldWeatherJSON["list"][0]["main"]["feels_like"]
        humidity = oldWeatherJSON["list"][0]["main"]["humidity"]
        wind_speed = oldWeatherJSON['list'][0]['wind']['speed']
        type = oldWeatherJSON['list'][0]['weather'][0]['main']

        return {"temperature": temperature,
                "feels_like": feels_like, "humidity": humidity, 'wind_speed': wind_speed, "from_current_api": False, "type": type}
