#!/bin/sh

if [ ! -d /certs ]; then
	mkdir -p /certs
fi

if [ ! -f /certs/server.key ]; then
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /certs/server.key -out /certs/server.crt \
	-subj "/CN=$HOST_NAME" \
	-addext "subjectAltName=DNS:$HOST_NAME,DNS:localhost,IP:127.0.0.1"
else
	echo "SSL certificates already exist, skipping generation."
fi
