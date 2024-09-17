#!/bin/sh

# Wait for the database to be ready
while ! nc -z postgres 5432; do
  sleep 0.1
done

# Run the migrations
python manage.py makemigrations
python manage.py migrate

# Start the server
python manage.py runserver
