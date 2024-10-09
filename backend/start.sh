#!/bin/sh

# Wait until the database is ready
while ! nc -z postgres 5432; do
	sleep 0.1
done

# Apply database migrations
python manage.py migrate

# Start server with SSL certificates
exec daphne -b 0.0.0.0 -e ssl:8443:privateKey=/certs/server.key:certKey=/certs/server.crt backend.asgi:application
