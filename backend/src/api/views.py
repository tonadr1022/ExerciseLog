from django.shortcuts import render
from rest_framework import viewsets
from .models import Exercise, WeatherInstance, Shoe
from .serializers import ExerciseSerializer, ShoeSerializer, WeatherInstanceSerializer, ExerciseReadOnlySerializer, ShoeReadOnlySerializer
from . import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django import http
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
import json
import requests
from users.models import NewUser
import datetime
from pathlib import Path
import os
import environ
from django.http import HttpResponseRedirect
import urllib.parse
from django.utils import timezone

env = environ.Env()
BASE_DIR = Path(__file__).resolve().parent.parent.parent
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


class WeatherInstanceListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        weather = WeatherInstance.objects.all()
        serializer = WeatherInstanceSerializer(weather, many=True)
        return Response(serializer.data)


class ShoesAllUsersListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        queryset = Shoe.objects.filter(is_public=True)
        serializer = ShoeReadOnlySerializer(
            queryset, context={'request': request}, many=True)
        return Response(serializer.data)


class ExercisesAllUsersListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        exercise = Exercise.objects.filter(is_public=True)
        serializer = ExerciseReadOnlySerializer(exercise, many=True)
        return Response(serializer.data)


class ExerciseViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

    def get_queryset(self):
        """
        This view should return a list of all the exercises
        for the currently authenticated user.
        """
        user = self.request.user
        return self.queryset.filter(user=user)


class ShoeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Shoe.objects.all()
    serializer_class = ShoeSerializer

    def get_queryset(self):
        """
        This view should return a list of all the exercises
        for the currently authenticated user.
        """
        user = self.request.user
        return self.queryset.filter(user=user)


def get_authorization(user, code):
    url = 'https://www.strava.com/oauth/token'
    params = {
        'client_id': env('STRAVA_CLIENT_ID'),
        'client_secret': env('STRAVA_CLIENT_SECRET'),
        'code': code,
        'grant_type': 'authorization_code',
    }
    auth_response = requests.post(url, params)
    token_json = auth_response.json()
    return token_json


class StravaAuthorizationView(APIView):
    def get(self, request):
        try:
            state = request.query_params.get('state')
            code = request.query_params.get('code')
            scope = request.query_params.get('scope')
            user_id = json.loads(urllib.parse.unquote(state))['user_id']
            user = NewUser.objects.get(id=user_id)
            strava_user_data = get_authorization(user, code)
            user.strava_authorized = True
            user.strava_athlete_id = strava_user_data['athlete']['id']
            user.strava_access_token = strava_user_data['access_token']
            user.strava_refresh_token = strava_user_data['refresh_token']
            user.strava_access_token_expiration = datetime.datetime.utcfromtimestamp(
                strava_user_data['expires_at'])
            user.save()
            return HttpResponseRedirect('http://localhost:5173')

        except json.JSONDecodeError:
            return Response({'Error': 'Invalid state parameter'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({"Error": "Unexpected Error Occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StravaWebhookView(APIView):
    # def get(self, request, *args, **kwargs):
    #     print('query_params', request.query_params)
    #     # verify_token = request.query_params.get('verify_token')
    #     # if verify_token and verify_token != 'STRAVA':
    #     #     return Response({'error': 'Invalid verify token: ' + str(verify_token)})
    #     # hub_challenge = request.query_params.get('hub.challenge')
    #     # if hub_challenge:
    #     #     respone_data = {
    #     #         'hub.challenge': hub_challenge,
    #     #     }
    #     #     return Response(respone_data, status=status.HTTP_200_OK)
    #     return Response({'error': 'Invalid request'}, status=400)
    def post(self, request, *args, **kwargs):
        data = request.data
        print(data)
        if data.get('owner_id'):
            user = NewUser.objects.get(strava_athlete_id=data['owner_id'])
        else:
            print('error, no owner ID')
            return Response({'Error': 'No Owner ID'}, status=status.HTTP_400_BAD_REQUEST)

        if user.strava_access_token_expiration < timezone.now():
            print('refreshing authentication for this user')
            self.refresh_authentication(user)

        if data.get('object_id'):
            print('getting and adding strava activity for this user')
            saved_status = self.get_strava_activity(user, data['object_id'])
            if saved_status == 'saved':
                return Response({'Success': 'Activity Created'}, status=status.HTTP_201_CREATED)

    def refresh_authentication(self, user):
        refresh_token = user.strava_refresh_token
        refresh_url = "https://www.strava.com/api/v3/oauth/token"
        refresh_params = {
            'client_id': env("STRAVA_CLIENT_ID"),
            'client_secret': env("STRAVA_CLIENT_SECRET"),
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
        }
        refresh_response = requests.post(
            refresh_url, data=refresh_params, allow_redirects=False)
        if refresh_response.status_code == 200:
            refresh_data = refresh_response.json()
            user.strava_access_token = refresh_data['access_token']
            user.strava_refresh_token = refresh_data['refresh_token']
            user.strava_access_token_expiration = datetime.datetime.utcfromtimestamp(
                refresh_data['expires_at'])
        else:
            # Request failed, handle the error
            print('Refresh request failed with status code',
                  refresh_response.status_code)

    def get_strava_activity(self, user, object_id):
        access_token = user.strava_access_token
        strava_api_url = f"https://www.strava.com/api/v3/activities/{object_id}"
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        exercise_response = requests.get(
            strava_api_url, headers=headers)

        if exercise_response.status_code == 200:
            activity_data = exercise_response.json()
            serializer = serializers.StravaActivitySerializer(
                data=activity_data)
            serializer.is_valid(raise_exception=True)
            strava_act_data = serializer.data
            print(strava_act_data)

            user = NewUser.objects.get(id=1)
            datetime_object = datetime.datetime.strptime(strava_act_data[
                'start_date'], "%Y-%m-%dT%H:%M:%S%z")
            if len(Exercise.objects.filter(datetime_started=datetime_object)) > 0:
                return Response({'Unnecessary': 'Duplicate Activity'}, status=status.HTTP_208_ALREADY_REPORTED)
            serializer = ExerciseSerializer(data={
                'user': user.id,
                'name': strava_act_data['name'],
                'distance': strava_act_data['distance'],
                'duration': strava_act_data['duration'],
                'act_type': strava_act_data['type'],
                'workout_type': strava_act_data['workout_type'],
                'datetime_started': datetime_object,
                'location': strava_act_data['location'],
                'average_heartrate': strava_act_data['average_heartrate']
            })  # type: ignore
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return 'saved'

            # update activity: {'aspect_type': 'update', 'event_time': 1685653205, 'object_id': 9184455103,
            # 'object_type': 'activity', 'owner_id': 106301232, 'subscription_id': 242732, 'updates': {'title': 'G'}}
        return 'not saved'


# class ExerciseListView(APIView):
#     def get(self, request, format=None):
#         exercises = Exercise.objects.all()
#         serializer = ExerciseSerializer(exercises, many=True)
#         return Response(serializer.data)

#     def post(self, request, format=None):
#         serializer = ExerciseSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class ShoeListView(APIView):
#     def get(self, request, format=None):
#         shoes = Shoe.objects.all()
#         serializer = ShoeSerializer(shoes, many=True)
#         return Response(serializer.data)

#     def post(self, request, format=None):
#         serializer = ShoeSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class ShoeDetailView(APIView):
#     def get_object(self, pk):
#         try:
#             return Shoe.objects.get(pk=pk)
#         except Shoe.DoesNotExist:
#             raise http.Http404

#     def get(self, request, pk, format=None):
#         shoe = self.get_object(pk)
#         serializer = ShoeSerializer(shoe)
#         return Response(serializer.data)

#     def put(self, request, pk, format=None):
#         snippet = self.get_object(pk)
#         serializer = ShoeSerializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk, format=None):
#         shoe = self.get_object(pk)
#         shoe.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


# class ExerciseDetailView(APIView):
#     def get_object(self, pk):
#         try:
#             return Exercise.objects.get(pk=pk)
#         except Exercise.DoesNotExist:
#             raise http.Http404

#     def get(self, request, pk, format=None):
#         exercise = self.get_object(pk)
#         serializer = ExerciseSerializer(exercise)
#         return Response(serializer.data)

#     def put(self, request, pk, format=None):
#         snippet = self.get_object(pk)
#         serializer = ExerciseSerializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk, format=None):
#         exercise = self.get_object(pk)
#         exercise.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
