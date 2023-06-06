from pathlib import Path
import os
import environ
from django.http import HttpResponseRedirect
import urllib.parse
from django.utils import timezone, timesince
import json
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import StravaActivitySerializer
from api.serializers import ExerciseSerializer
from api.models import Exercise, Map
from users.models import NewUser
import datetime
import requests
from django.core.exceptions import ObjectDoesNotExist
import traceback

env = environ.Env()
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


def get_authorization(user, code):

    url = 'https://www.strava.com/oauth/token'
    params = {
        'client_id': '103399',
        'client_secret': 'bcd76a46c271b862eb75985908b5a8cf59b5b4de',
        'code': code,
        'grant_type': 'authorization_code',
    }
    auth_response = requests.post(url, params)
    token_json = auth_response.json()
    return token_json


class StravaWebhookSubscriptionView(APIView):
    def get(self, request):
        # create subscription
        hub_challenge = request.query_params.get('hub.challenge')
        if hub_challenge:
            response_data = {
                'hub.challenge': hub_challenge,
            }
            return Response(response_data, status=status.HTTP_200_OK)


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
            return HttpResponseRedirect('https://exerciselog-324bd.web.app/')

        except json.JSONDecodeError:
            return Response({'Error': 'Invalid state parameter'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            traceback.print_exc()
            return Response({"Error": "Unexpected Error Occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StravaWebhookView(APIView):
    authentication_classes = []
    permission_classes = []

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
            user.save()
            print('refreshed authentication')
        else:
            # Request failed, handle the error
            print('Refresh request failed with status code',
                  refresh_response.status_code)

    def get(self, request, *args, **kwargs):
        print('here')
        print('query_params', request.query_params)
        # verify_token = request.query_params.get('verify_token')
        # if verify_token and verify_token != 'STRAVA':
        #     return Response({'error': 'Invalid verify token: ' + str(verify_token)})
        hub_challenge = request.query_params.get('hub.challenge')
        if hub_challenge:
            response_data = {
                'hub.challenge': hub_challenge,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid request'}, status=400)

    def post(self, request, *args, **kwargs):
        data = request.data
        print(request.data)
        if data.get('owner_id'):
            user = NewUser.objects.get(strava_athlete_id=data['owner_id'])
            print('strava access token', user.strava_access_token)
        else:
            print('error, no owner ID')
            return Response({'Error': 'No Owner ID'}, status=status.HTTP_200_OK)
        if user.strava_access_token_expiration < timezone.now():
            print('refreshing authentication for this user')
            self.refresh_authentication(user)

        if data.get('object_id'):
            try:
                object_id = data['object_id']

                if data['aspect_type'] == 'delete':
                    Exercise.objects.get(strava_id=object_id).delete()
                    print('activity deleted')
                    return Response({'Success': 'Activity deleted'}, status=status.HTTP_200_OK)

                print('getting and adding or replacing strava activity for this user')
                # get the activity by ID
                access_token = user.strava_access_token

                print('object id', object_id)
                if len(Exercise.objects.filter(strava_id=object_id)) > 0:
                    print('Object found already')
                    Exercise.objects.get(strava_id=object_id).delete()
                    print('Object deleted')
                strava_api_url = f"https://www.strava.com/api/v3/activities/{object_id}"
                headers = {
                    'Authorization': f'Bearer {access_token}'
                }
                exercise_response = requests.get(
                    strava_api_url, headers=headers)
                # If 401 status, try again ONCE after refreshing authentication
                print('get ex response status: ',
                      exercise_response.status_code)
                if exercise_response.status_code == 401:
                    self.refresh_authentication(user)
                    access_token = user.strava_access_token
                    headers = {
                        'Authorization': f'Bearer {access_token}'
                    }
                    exercise_response = requests.get(
                        strava_api_url, headers=headers)

                if exercise_response.status_code == 200:
                    activity_data = exercise_response.json()
                    map_id = activity_data['map'].get('id', None)
                    if activity_data['map']['polyline'] != '':
                        Map.objects.filter(id=map_id).delete()
                    serializer = StravaActivitySerializer(
                        data=activity_data)
                    serializer.is_valid(raise_exception=True)
                    strava_act_data = serializer.data
                    datetime_object = datetime.datetime.strptime(strava_act_data[
                        'start_date'], "%Y-%m-%dT%H:%M:%S%z")
                    print('attempting to serialize')
                    print('strava id:  ', strava_act_data.get('id', 'NO ID'))
                    print(strava_act_data)
                    serializer = ExerciseSerializer(data={
                        'user': user.id,
                        'name': strava_act_data.get('name', None),
                        'distance': strava_act_data.get('distance', None),
                        'duration': strava_act_data.get('duration', None),
                        'act_type': strava_act_data.get('type', None),
                        'workout_type': strava_act_data.get('workout_type', None),
                        'datetime_started': datetime_object,
                        'location': strava_act_data.get('location', None),
                        'average_heartrate': strava_act_data.get('average_heartrate', None),
                        'strava_id': strava_act_data.get('id', None),
                        'max_heartrate': strava_act_data.get('max_heartrate', None),
                        'total_elevation_gain': strava_act_data.get('total_elevation_gain', None),
                        'calories': strava_act_data.get('calories', None),
                        'map': strava_act_data.get('map', None),
                    })  # type: ignore
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                    return Response({'Success': 'Activity Created'}, status=status.HTTP_200_OK)
                else:
                    print(exercise_response.text)
                    return Response({"Error": "Could not save activity"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception:
                print(traceback.print_exc())
                print('not saved')
                return Response({"Error": "Could not save activity"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # update activity: {'aspect_type': 'update', 'event_time': 1685653205, 'object_id': 9184455103,
        # 'object_type': 'activity', 'owner_id': 106301232, 'subscription_id': 242732, 'updates': {'title': 'G'}}
