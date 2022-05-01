FROM node:lts-alpine

ARG VUE_APP_BACKEND_URL=${VUE_APP_BACKEND_URL}

RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV VUE_APP_BACKEND_URL=${VUE_APP_BACKEND_URL}

RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]