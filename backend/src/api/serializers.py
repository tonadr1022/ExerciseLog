from .models import Exercise, Shoe, WeatherInstance
from rest_framework import serializers


class WeatherInstanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = WeatherInstance
        fields = ['id', 'temperature', 'humidity', 'feels_like']


class ExerciseSerializer(serializers.ModelSerializer):
    weather = WeatherInstanceSerializer()

    class Meta:
        model = Exercise
        fields = ['id', 'user', 'name', 'act_type', 'datetime_started', 'duration',
                  'distance', 'pace', 'rating', 'notes', 'log_notes', 'location', 'shoe', 'weather']


class ShoeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Shoe
        fields = ['nickname', 'brand', 'model',
                  'notes', 'distance_run', 'image_url']
