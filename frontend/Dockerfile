FROM node:20.15.1-alpine3.19

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npm run build

# Install a lightweight web server
RUN npm install -g http-server

EXPOSE 3000

CMD ["http-server", "build", "--ssl", "--cert", "/certs/server.crt", "--key", "/certs/server.key", "-p", "3000", "-a", "0.0.0.0"]
