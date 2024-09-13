#!/bin/sh

# Wait until the database is ready
while ! nc -z postgres 5432; do
	sleep 0.1
done

# Apply database migrations
python manage.py makemigrations
python manage.py migrate

# Start server
#python manage.py runserver 0.0.0.0:8000
daphne -b 0.0.0.0 -p 8000 backend.asgi:application