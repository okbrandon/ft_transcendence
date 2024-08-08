#prod
# ARG PYTHON_VERSION=3.12-slim-bullseye

# FROM python:${PYTHON_VERSION}

# ENV PYTHONDONTWRITEBYTEapp 1
# ENV PYTHONUNBUFFERED 1

# # install psycopg2 dependencies.
# RUN apt-get update && apt-get install -y \
#     libpq-dev \
#     gcc \
#     && rm -rf /var/lib/apt/lists/*

# RUN mkdir -p /app

# WORKDIR /app

# COPY requirements.txt /tmp/requirements.txt
# RUN set -ex && \
#     pip install --upgrade pip && \
#     pip install -r /tmp/requirements.txt && \
#     rm -rf /root/.cache/
# COPY . /app

# EXPOSE 8000

# CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind :8000 --workers 2 backend.wsgi"]

#debug 
FROM python:3.10-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]