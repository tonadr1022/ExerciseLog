from datetime import datetime, timedelta


def most_recent_monday_utc(dt=None):
    if not dt:
        dt = datetime.utcnow()
    curr_weekday = dt.weekday()
    days_to_subtract = (curr_weekday) % 7
    return (dt - timedelta(days_to_subtract)).replace(hour=0, minute=0, second=0)


def get_recent_year_start_utc(dt=None):
    if not dt:
        dt = datetime.utcnow()
    return datetime.utcnow().replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
