FROM node:10.23.2-alpine3.11
LABEL maintainer="nguyenvannhon16111999@gmail.com"
RUN apk add --no-cache tzdata  \
    && ln -sf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime \
    && apk update \
    && npm install -g nodemon \
    && npm i pm2 -g \
    && npm install
COPY package.json package.json  
RUN  npm start
WORKDIR /myapp
COPY . /myapp

EXPOSE 8000