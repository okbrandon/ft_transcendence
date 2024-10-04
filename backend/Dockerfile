FROM python:3.10-slim-buster

WORKDIR /app

RUN apt-get update && apt-get install -y netcat

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .
COPY start.sh /app/start.sh

EXPOSE 8443

# Runs server with Daphne in production
CMD ["sh", "/app/start.sh"]
