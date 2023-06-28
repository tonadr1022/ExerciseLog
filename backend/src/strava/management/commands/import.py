from django.core.management.base import BaseCommand, CommandError
from api.models import Exercise
from strava.serializers import StravaActivitySerializer
from api.serializers import ExerciseSerializer, MapSerializer
from users.models import NewUser
import datetime
import json
import traceback

# combined_detailed_activities


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        with open('strava/combined_detailed_activities.json') as activity_json:
            activities = json.load(activity_json)
        failed = []
        for idx in range(len(activities)):
            try:
                activity_data = activities[idx]
                serializer = StravaActivitySerializer(
                    data=activity_data)
                serializer.is_valid(raise_exception=True)
                strava_act_data = serializer.data

                user = NewUser.objects.get(id=1)
                datetime_object = datetime.datetime.strptime(strava_act_data[
                    'start_date'], "%Y-%m-%dT%H:%M:%S%z")
                if len(Exercise.objects.filter(datetime_started=datetime_object)) > 0:
                    continue
                map_data = strava_act_data['map']
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
                    'map': map_data,
                })  # type: ignore
                serializer.is_valid(raise_exception=True)
                serializer.save()
                self.stdout.write('\nsaved ' + str(idx + 1) + ' successfully')
                print(failed)
            except Exception as e:
                failed.append(idx)
                print(failed)
                msg = traceback.format_exc()
                self.stdout.write(msg)
