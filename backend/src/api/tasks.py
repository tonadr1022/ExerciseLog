from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from api.models import WeeklySummaryStatistics
from api.datetime_utils import most_recent_monday_utc


@shared_task
def create_or_update_weekly_summary():

    # create
    most_recent_monday = most_recent_monday_utc()
    next_week_start = most_recent_monday + timedelta(weeks=1)
    if not WeeklySummaryStatistics.objects.get(week_start_datetime=next_week_start):
        WeeklySummaryStatistics.objects.create(week_start_datetime=next_week_start,
                                               week_end_datetime=next_week_start + timedelta(weeks=1))
