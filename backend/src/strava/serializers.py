from rest_framework import serializers
from utils import weather_api
from users.models import NewUser
from api.models import Map


class MapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Map
        fields = ['id', 'polyline', 'resource_state',
                  'summary_polyline']


class StravaActivitySerializer(serializers.Serializer):
    athlete_id = serializers.SerializerMethodField(required=False)
    name = serializers.CharField(required=False)
    distance = serializers.SerializerMethodField(required=False)
    duration = serializers.SerializerMethodField(required=False)
    total_elevation_gain = serializers.SerializerMethodField(required=False)
    type = serializers.SerializerMethodField(required=False)
    workout_type = serializers.SerializerMethodField(required=False)
    start_date = serializers.DateTimeField(required=False)
    location = serializers.SerializerMethodField(required=False)
    average_heartrate = serializers.FloatField(required=False)
    max_heartrate = serializers.FloatField(required=False)
    id = serializers.IntegerField(required=False)
    calories = serializers.DecimalField(
        required=False, max_digits=10, decimal_places=1)
    map = MapSerializer(required=False)

    def get_athlete_id(self, obj):
        return self.initial_data['athlete']['id']

    def get_location(self, obj):
        if self.initial_data.get('start_latlng'):
            lat = self.initial_data['start_latlng'][0]
            lng = self.initial_data['start_latlng'][1]
            return weather_api.get_formatted_loc_from_coords(lat, lng)

    def get_distance(self, obj):
        if self.initial_data.get('distance') and self.initial_data['distance'] > 0:
            return round(self.initial_data['distance'] / 1609.34, 2)
        else:
            return None

    def get_duration(self, obj):
        if self.initial_data.get('moving_time'):
            moving_time = self.initial_data['moving_time']
            return moving_time if moving_time > 0 else None

    def get_total_elevation_gain(self, obj):
        if self.initial_data.get('total_elevation_gain') and self.initial_data['total_elevation_gain'] > 0:
            return round(self.initial_data['total_elevation_gain'] * 3.281)
        else:
            return None

    def get_workout_type(self, obj):
        if self.initial_data.get('workout_type'):
            if self.initial_data['workout_type'] == 3:
                return 'Workout'
            elif self.initial_data['workout_type'] == 2:
                return 'Long'
            elif self.initial_data['workout_type'] == 1:
                return 'Race'
            else:
                return 'Standard'
        else:
            return 'Standard'

    def get_type(self, obj):
        if self.initial_data.get('type'):
            strava_type = self.initial_data['type']
            if strava_type in ['EBikeRide', 'Ride', 'Ride (Cycling)']:
                return 'Bike'
            elif strava_type in ['Workout']:
                return 'Elliptical'
            elif strava_type in ['AlpineSki']:
                return 'Alpine Ski'
            else:
                return strava_type
        else:
            return None
