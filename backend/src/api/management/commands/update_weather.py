from django.core.management.base import BaseCommand
import json
from api.models import Exercise, Map
from api.serializers import ExerciseSerializer
from django.db.models import Q
import random
import string


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        exercises = Exercise.objects.filter(
            Q(weather_id=None) | Q(weather__from_current_api=True))
        for exercise in exercises:
            old_ex = ExerciseSerializer(exercise).data
            if exercise.shoe is None:
                old_ex.pop('shoe')
            serializer = ExerciseSerializer(
                data=old_ex)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
