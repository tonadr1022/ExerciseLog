from rest_framework.fields import empty
from .models import Exercise, Shoe, WeatherInstance
from rest_framework import serializers
from . import weather_api_req
from users.models import NewUser

# class StravaAthleteSerializer(serializers.Serializer):
#     id = serializers.IntegerField()


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
    average_heartrate = serializers.SerializerMethodField(required=False)

    def get_athlete_id(self, obj):
        return self.initial_data['athlete']['id']

    def get_location(self, obj):
        if self.initial_data.get('start_latlng'):
            lat = self.initial_data['start_latlng'][0]
            lng = self.initial_data['start_latlng'][1]
            return weather_api_req.get_formatted_loc_from_coords(lat, lng)

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
            return self.initial_data['total_elevation_gain'] * 3.281
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
            if self.initial_data['type'] in ['EBikeRide', 'Ride', 'Ride (Cycling)']:
                return 'Bike'
            return self.initial_data['type']
        return None

    def get_average_heartrate(self, obj):
        if self.initial_data.get('average_heartrate'):
            print('avg', self.initial_data['average_heartrate'])
            return self.initial_data['average_heartrate']
        else:
            print('no heartrate')
            return None


class StravaUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['id', 'strava_access_token', 'strava_refresh_token']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['id', 'email', 'user_name',
                  'first_name', 'last_name', 'start_date',]


class ExerciseReadOnlySerializer(serializers.ModelSerializer):
    weather = serializers.SerializerMethodField()
    shoe = serializers.SlugRelatedField(
        queryset=Shoe.objects.all(), slug_field='nickname')
    user = serializers.SerializerMethodField()

    class Meta:
        model = Exercise
        fields = ['id', 'user', 'is_public', 'name', 'act_type', 'workout_type', 'datetime_started', 'duration',
                  'distance', 'pace', 'rating', 'notes', 'log_notes', 'location', 'shoe', 'weather']

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
    weather = serializers.SerializerMethodField()
    shoe = serializers.SlugRelatedField(
        queryset=Shoe.objects.all(), slug_field='nickname', required=False)

    class Meta:
        model = Exercise
        fields = ['id', 'user', 'workout_type', 'is_public', 'shoe', 'weather', 'name', 'act_type', 'datetime_started',
                  'duration', 'distance', 'pace', 'rating', 'notes', 'log_notes', 'location', 'average_heartrate', 'total_elevation_gain']
        extra_kwargs = {
            'user': {'write_only': True},
        }

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
        print(validated_data)
        if validated_data['location'] == '':
            location = weather_api_req.get_location(None)
            if location is not None:
                validated_data['location'] = location['formatted_loc']
        else:
            location = weather_api_req.get_location(
                validated_data['location'])
            if location is not None:
                validated_data['location'] = location['formatted_loc']
                weather_data = weather_api_req.get_weather_from_coordinates(
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
        exercise = Exercise.objects.create(**validated_data)
        return exercise

    def update(self, instance, validated_data):
        print(validated_data)
        if validated_data['location'] == '':
            location = weather_api_req.get_location(None)
            if location is not None:
                validated_data['location'] = location['formatted_loc']
        else:
            location = weather_api_req.get_location(
                validated_data['location'])
            if location is not None:
                validated_data['location'] = location['formatted_loc']
                weather_data = weather_api_req.get_weather_from_coordinates(
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


class ExerciseSerializerSlim(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'user', 'is_public', 'name', 'act_type', 'workout_type', 'datetime_started', 'duration',
                  'distance', 'pace', 'rating', 'notes', 'log_notes', 'location']


class WeatherInstanceSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializerSlim(many=True, read_only=True)
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
