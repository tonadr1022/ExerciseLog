from celery import shared_task
import requests
from datetime import datetime
from users.models import NewUser
from django.utils import timezone
from strava.serializers import StravaActivitySerializer
from api.models import Exercise
from api.serializers import ExerciseSerializer


def refresh_authentication(user):
    refresh_token = user.strava_refresh_token
    refresh_url = "https://www.strava.com/api/v3/oauth/token"
    refresh_params = {
        'client_id': '103399',
        'client_secret': 'bcd76a46c271b862eb75985908b5a8cf59b5b4de',
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
    }
    refresh_response = requests.post(
        refresh_url, data=refresh_params, allow_redirects=False)
    if refresh_response.status_code == 200:
        refresh_data = refresh_response.json()
        user.strava_access_token = refresh_data['access_token']
        user.strava_refresh_token = refresh_data['refresh_token']
        user.strava_access_token_expiration = datetime.utcfromtimestamp(
            refresh_data['expires_at'])
        user.save()
        print('refreshed authentication')
    else:
        # Request failed, handle the error
        print('Refresh request failed with status code',
              refresh_response.status_code)


@shared_task
def import_strava_activities(user_pk):
    user = NewUser.objects.get(pk=user_pk)
    # get access token and refresh if needed
    access_token = user.strava_access_token
    if user.strava_access_token_expiration < timezone.now():
        print('refreshing authentication for this user')
        print('old', access_token)
        refresh_authentication(user)
        access_token = user.strava_access_token
        print('new', access_token)
    # fetch all athlete activities, max is 200 per page. Iterate through pages until empty
    page_num = 1
    strava_api_url = f"https://www.strava.com/api/v3/athlete/activities"
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    failed_activity_start_datetimes = []
    maps = set()
    while True:
        params = {
            'page': page_num,
            'per_page': 200
        }
        response = requests.get(
            url=strava_api_url, headers=headers, params=params)
        response.raise_for_status()
        activities = response.json()

        if len(activities) == 0:
            break
        page_num += 1
        # for each activity, deserialize into object and put it into Exercise serializer
        for activity in activities:
            try:
                serializer = StravaActivitySerializer(
                    data=activity)
                serializer.is_valid(raise_exception=True)
                strava_act_data = serializer.data
                print('curr map id', strava_act_data.get('map')['id'])
                if strava_act_data.get('map')['id'] in maps:
                    print(strava_act_data.get('map')['id'])
                    print(strava_act_data.get('name'),
                          strava_act_data.get('distance'))
                maps.add(strava_act_data.get('map')['id'])
                datetime_object = datetime.strptime(strava_act_data[
                    'start_date'], "%Y-%m-%dT%H:%M:%S%z")
                if len(Exercise.objects.filter(datetime_started=datetime_object)) > 0:
                    continue
                print(len(Exercise.objects.filter(
                    datetime_started=datetime_object)), strava_act_data.get('name', strava_act_data['start_date']))

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
                    'calories': strava_act_data.get('calories', None),
                    'total_elevation_gain': strava_act_data.get('total_elevation_gain', None),
                    'map': strava_act_data.get('map', None),
                })  # type: ignore
                serializer.is_valid(raise_exception=True)
                serializer.save()
            except Exception as e:
                print('error', e)
                return
                # print('err', e)
                # failed_activity_start_datetimes.append(
                #     (strava_act_data.get('name'), strava_act_data.get('distance')))
                # print(failed_activity_start_datetimes)
                # continue
    user.strava_activities_imported = True
    user.save()
