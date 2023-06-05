from django.core.management.base import BaseCommand
import json


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        with open('strava/recent_activities.json') as file:
            data = json.load(file)
            print(len(data))
