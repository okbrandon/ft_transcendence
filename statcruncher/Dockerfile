FROM python:3.10-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

RUN apt-get update && apt-get install -y netcat

EXPOSE 9000

CMD ["/bin/sh", "start.sh"]
