from api.models import Exercise, Map, WeatherInstance, Shoe
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        Exercise.objects.all().delete()
        Map.objects.all().delete()
        WeatherInstance.objects.all().delete()
        Shoe.objects.all().delete()
