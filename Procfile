release: python backend/src/manage.py migrate --chdir backend/src
web: gunicorn exercise_log.wsgi --log-file --chdir backend/src