# --
# Building the React app.
# --
FROM node:20.15.1-alpine3.19 AS build

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npm run build

# --
# Setup the NGINX Server to serve the React app
# --
FROM nginx:1.27.1-alpine AS production

COPY --from=build /app/build /usr/share/nginx/html

COPY ./config/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
