#!/bin/sh

# Apply database migrations
python3 manage.py migrate

# Start server with port 5000
exec daphne -b 0.0.0.0 -p 5000 -e ssl:5443:privateKey=/certs/server.key:certKey=/certs/server.crt pongbot.asgi:application
