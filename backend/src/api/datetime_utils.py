from datetime import datetime, timedelta
from dateutils import relativedelta


def most_recent_monday_utc(dt=None):
    if not dt:
        dt = datetime.utcnow()
    curr_weekday = dt.weekday()
    days_to_subtract = (curr_weekday) % 7
    return (dt - timedelta(days_to_subtract)).replace(hour=1, minute=0, second=0)


def get_year_start_utc(year: int | None = None):
    if year:
        dt = datetime.utcnow().replace(year=year, month=1, day=1,
                                       hour=1, minute=0, second=0, microsecond=0)
    else:
        dt = datetime.utcnow()
    return dt.replace(month=1, day=1, hour=1, minute=0, second=0, microsecond=0)


def get_week_datetime_ranges(year: int | None = None):
    datetime_start = get_year_start_utc(year)
    if year:
        end_of_year_datetime = datetime.now().replace(
            year=year, month=12, day=31, hour=23, minute=59)
        starting_monday = most_recent_monday_utc(end_of_year_datetime)
    else:
        starting_monday = most_recent_monday_utc()
    week_ranges = []
    while starting_monday > datetime_start:
        week_ranges.append({'start_datetime': starting_monday,
                            'end_datetime': starting_monday+relativedelta(weeks=1)})
        starting_monday = starting_monday - relativedelta(weeks=1)
    week_ranges.reverse()
    # week_ranges = []
    # for i in range(52):
    #     curr_datetime_start = datetime_start+relativedelta(weeks=i)
    #     if curr_datetime_start > datetime.now():
    #         break
    #     week_ranges.append({'start_datetime': curr_datetime_start,
    #                         'end_datetime': curr_datetime_start+relativedelta(weeks=1)})
    return week_ranges


def get_month_datetime_ranges(year: int | None = None):
    datetime_start = get_year_start_utc(year)
    month_ranges = []
    for i in range(12):
        curr_datetime_start = datetime_start+relativedelta(months=i)
        if curr_datetime_start > datetime.now():
            break
        month_ranges.append({'start_datetime': curr_datetime_start,
                            'end_datetime': curr_datetime_start+relativedelta(months=1)})
    return month_ranges
