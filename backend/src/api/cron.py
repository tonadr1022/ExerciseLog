from .models import Exercise
from django.utils import timezone
import datetime
import logging
logger = logging.getLogger(__name__)


def update_weather():
    logger.info('updating weather for all recent activities')
    twelve_ago = datetime.datetime.utcnow() - datetime.timedelta(hours=12)
    logger.info(twelve_ago)
    exercises = Exercise.objects.filter(
        datetime_started__gt=twelve_ago, from_current=True)
    logger.info(exercises)
