from rest_framework.fields import empty
from .models import Exercise, Shoe, WeatherInstance
from rest_framework import serializers
from . import weather_api_req
from users.models import NewUser


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
        queryset=Shoe.objects.all(), slug_field='nickname')

    class Meta:
        model = Exercise
        fields = ['id', 'user', 'is_public', 'name', 'act_type', 'workout_type', 'datetime_started', 'duration',
                  'distance', 'pace', 'rating', 'notes', 'log_notes', 'location', 'shoe', 'weather']
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
