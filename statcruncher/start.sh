#!/bin/sh

# Wait for the database to be ready
while ! nc -z postgres 5432; do
  sleep 0.1
done

# Run the migrations
python3 manage.py migrate

# Start the server
python3 manage.py runserver_plus --cert-file /certs/server.crt --key-file /certs/server.key 0.0.0.0:9000