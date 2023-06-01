import requests
from requests import HTTPError
import datetime
from django.utils import timezone
from pathlib import Path
import os
import environ

env = environ.Env()
BASE_DIR = Path(__file__).resolve().parent.parent.parent
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


def get_formatted_loc_from_coords(lat, lng):
    params = {'latlng': f'{lat},{lng}',
              'key': env("GEOLOCATE_API_KEY")}
    url = env('GEOLOCATE_INPUT_URL')
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
    geolocate_api_key = env('GEOLOCATE_API_KEY')
    if location is None:
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
                  "address": location, "key": geolocate_api_key}
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
            "appid": env("WEATHER_API_KEY"),
            "units": "imperial"
        }
        url = env("CURR_WEATHER_URL")
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
            "appid": env("WEATHER_API_KEY"),
            "units": "imperial"
        }
        weatherURL = env("HIST_WEATHER_URL")
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
