from .models import Exercise, Shoe, WeatherInstance, Map
from rest_framework import serializers
from utils import weather_api
from users.models import NewUser
from strava.serializers import MapSerializer
from .datetime_utils import most_recent_monday_utc
from datetime import timedelta


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['id', 'email', 'user_name',
                  'first_name', 'last_name', 'start_date', 'strava_authorized']


class ExerciseSlimSerializer(serializers.ModelSerializer):
    weather = serializers.SerializerMethodField()
    shoe = serializers.SlugRelatedField(
        queryset=Shoe.objects.all(), slug_field='nickname')

    class Meta:
        model = Exercise
        fields = ['id', 'user', 'is_public', 'name', 'act_type', 'workout_type', 'datetime_started', 'duration',
                  'distance', 'pace', 'rating', 'notes', 'log_notes', 'location', 'average_heartrate',
                  'max_heartrate', 'total_elevation_gain', 'shoe', 'weather', 'calories']

    def get_weather(self, exercise):
        if exercise.weather is not None:
            return {
                'id': exercise.weather.id,
                'temperature': exercise.weather.temperature,
                'humidity': exercise.weather.humidity,
                'feels_like': exercise.weather.feels_like,
                'wind_speed': exercise.weather.wind_speed,
                'from_current_api': exercise.weather.from_current_api,
                'type': exercise.weather.type,
            }
        return None


class ExerciseReadOnlySerializer(serializers.ModelSerializer):
    weather = serializers.SerializerMethodField()
    shoe = serializers.SlugRelatedField(
        queryset=Shoe.objects.all(), slug_field='nickname')
    user = serializers.SerializerMethodField()
    map = MapSerializer(required=False)

    class Meta:
        model = Exercise
        fields = ['id', 'strava_id', 'user', 'is_public', 'name', 'act_type', 'workout_type', 'datetime_started', 'duration',
                  'distance', 'pace', 'rating', 'notes', 'log_notes', 'location', 'shoe', 'weather',
                  'average_heartrate', 'max_heartrate', 'total_elevation_gain', 'calories', 'map']

    def get_weather(self, exercise):
        if exercise.weather is not None:
            return {
                'id': exercise.weather.id,
                'temperature': exercise.weather.temperature,
                'humidity': exercise.weather.humidity,
                'feels_like': exercise.weather.feels_like,
                'wind_speed': exercise.weather.wind_speed,
                'from_current_api': exercise.weather.from_current_api,
                'type': exercise.weather.type,
            }
        return None

    def get_user(self, exercise):
        return {
            'first_name': exercise.user.first_name,
            'last_name': exercise.user.last_name,
        }


class ExerciseSerializer(serializers.ModelSerializer):
    weather = serializers.SerializerMethodField(required=False)
    shoe = serializers.SlugRelatedField(
        queryset=Shoe.objects.all(), slug_field='nickname', required=False)
    map = MapSerializer(required=False)
    # map = serializers.SerializerMethodField(required=False)

    class Meta:
        model = Exercise
        fields = ['id', 'strava_id', 'user', 'workout_type', 'is_public', 'shoe', 'weather', 'name', 'act_type', 'datetime_started',
                  'duration', 'distance', 'pace', 'rating', 'notes', 'log_notes', 'location',
                  'average_heartrate', 'max_heartrate', 'total_elevation_gain', 'calories', 'map']
        # extra_kwargs = {
        #     'user': {'write_only': True},
        # }

    def get_weather(self, exercise):
        if exercise.weather is not None:
            return {
                'id': exercise.weather.id,
                'temperature': exercise.weather.temperature,
                'humidity': exercise.weather.humidity,
                'feels_like': exercise.weather.feels_like,
                'wind_speed': exercise.weather.wind_speed,
                'from_current_api': exercise.weather.from_current_api,
                'type': exercise.weather.type,
            }
        return None

    def create(self, validated_data):
        print('serializer validated\n\n', validated_data)
        print('LOCATION:  ', validated_data['location'])
        if validated_data.get('location', None) and validated_data['location'].split(',')[0] == '':
            location = weather_api.get_location(None)
            print(location)
            if location is not None:
                validated_data['location'] = location['formatted_loc']
        else:
            location = weather_api.get_location(
                validated_data['location'])

        if location is not None:
            validated_data['location'] = location['formatted_loc']
            weather_data = weather_api.get_weather_from_coordinates(
                location, validated_data['datetime_started'])
            if weather_data and None not in weather_data.values():
                weather = WeatherInstance.objects.create(
                    user=validated_data['user'],
                    temperature=weather_data['temperature'],
                    humidity=weather_data['humidity'],
                    feels_like=weather_data['feels_like'],
                    wind_speed=weather_data['wind_speed'],
                    datetime=validated_data['datetime_started'],
                    from_current_api=weather_data['from_current_api'],
                    type=weather_data['type'])
                validated_data['weather'] = weather

       # Check if map data exists and create the Map instance
        map_data = validated_data.pop('map', None)
        if map_data is not None and map_data['polyline'] != '':
            map_instance = Map.objects.create(**map_data)
            validated_data['map'] = map_instance
            exercise = Exercise.objects.create(**validated_data)
            # map_instance.exercise = exercise
        else:
            exercise = Exercise.objects.create(**validated_data)
        return exercise

    def update(self, instance, validated_data):
        if validated_data['location'] == '':
            location = weather_api.get_location(None)
            if location is not None:
                validated_data['location'] = location['formatted_loc']
        else:
            location = weather_api.get_location(
                validated_data['location'])
            if location is not None:
                validated_data['location'] = location['formatted_loc']
                weather_data = weather_api.get_weather_from_coordinates(
                    location, validated_data['datetime_started'])
                if weather_data and None not in weather_data.values():
                    weather = WeatherInstance.objects.create(
                        user=validated_data['user'],
                        temperature=weather_data['temperature'],
                        humidity=weather_data['humidity'],
                        feels_like=weather_data['feels_like'],
                        wind_speed=weather_data['wind_speed'],
                        datetime=validated_data['datetime_started'],
                        from_current_api=weather_data['from_current_api'],
                        type=weather_data['type'])
                    validated_data['weather'] = weather
        return super().update(instance, validated_data)


class WeatherInstanceSerializer(serializers.ModelSerializer):
    exercise = ExerciseSlimSerializer(many=True, read_only=True)
    # exercise = serializers.SerializerMethodField()

    class Meta:
        model = WeatherInstance
        fields = ['id', 'user', 'datetime',
                  'temperature', 'humidity', 'feels_like', 'wind_speed', 'from_current_api', 'type', 'exercise']


class ShoeSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, read_only=True)
    image = serializers.ImageField(
        max_length=None,
        allow_empty_file=True,
        required=False,
    )

    class Meta:
        model = Shoe
        fields = ['id', 'user', 'is_public', 'nickname', 'brand', 'model',
                  'notes', 'distance_run', 'image', 'exercises',]


class ShoeReadOnlySerializer(serializers.ModelSerializer):
    image = serializers.ImageField()

    user = serializers.SerializerMethodField()

    class Meta:
        model = Shoe
        fields = ['id', 'user', 'is_public', 'brand',
                  'model', 'distance_run', 'image']

    def get_user(self, shoe):
        return {
            'first_name': shoe.user.first_name,
            'last_name': shoe.user.last_name,
        }
