FROM node:10-alpine

RUN apk add --no-cache git python python-dev py-pip build-base

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./

USER node

RUN npm config set registry http://registry.npmjs.org/ && npm install

ADD --chown=node:node server.tar .

EXPOSE 3000