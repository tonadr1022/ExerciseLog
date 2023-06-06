release: python backend/src/manage.py migrate
web: gunicorn exercise_log.wsgi --log-file - --chdir backend/src