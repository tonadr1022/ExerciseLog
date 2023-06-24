from django.core.management.base import BaseCommand
import json
import requests


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        access_token = 'd199d94d010c20e49a0cba210091a93b41cd40a3'
        with open('strava/recent_activities.json') as file:
            data = json.load(file)
            detailed_ex = []
            for exercise in data:
                object_id = exercise['id']
                strava_api_url = f"https://www.strava.com/api/v3/activities/{object_id}"
                headers = {
                    'Authorization': f'Bearer {access_token}'
                }
                res = requests.get(
                    strava_api_url, headers=headers)
                ex = res.json()
                detailed_ex.append(ex)
            with open('combined_post_june.json', 'w') as f:
                json.dump(detailed_ex, f, indent=2)
