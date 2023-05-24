from django.shortcuts import render
from rest_framework import viewsets
from .models import Exercise, WeatherInstance, Shoe
from .serializers import ExerciseSerializer, ShoeSerializer, WeatherInstanceSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django import http
from . import weather_api_req


class WeatherInstanceListView(APIView):
    def get(self, request, format=None):
        weather = WeatherInstance.objects.all()
        serializer = WeatherInstanceSerializer(weather, many=True)
        return Response(serializer.data)


class ExerciseListView(APIView):
    def get(self, request, format=None):
        exercises = Exercise.objects.all()
        serializer = ExerciseSerializer(exercises, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ExerciseSerializer(data=request.data)

        if serializer.is_valid():
            print(serializer.validated_data.keys())
            if 'location' not in serializer.validated_data.keys():
                print('need to get location')
            else:
                print(serializer.validated_data['location'])
                location = weather_api_req.get_location(
                    serializer.validated_data['location'])
                weather_data = weather_api_req.get_weather_from_coordinates(
                    location, serializer.validated_data['datetime_started'])
                print(weather_data)
                if None not in weather_data.values():
                    weather = WeatherInstance(
                        temperature=weather_data['temperature'],
                        humidity=weather_data['humidity'],
                        feels_like=weather_data['feels_like'])
                    weather.save()
                    serializer.validated_data['weather'] = weather
            print('\n\n\n\n')
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExerciseDetailView(APIView):
    def get_object(self, pk):
        try:
            return Exercise.objects.get(pk=pk)
        except Exercise.DoesNotExist:
            raise http.Http404

    def get(self, request, pk, format=None):
        exercise = self.get_object(pk)
        serializer = ExerciseSerializer(exercise)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = ExerciseSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        exercise = self.get_object(pk)
        exercise.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # def post(self, request):
    #     exercise = request.data.get('exercise')
    #     serializer = ExerciseSerializer(data=exercise)
    #     if serializer.is_valid():
