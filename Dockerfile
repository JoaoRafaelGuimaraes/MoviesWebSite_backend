FROM node:lts-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn add typescript ts-node
RUN yarn tsc

CMD [ "node", "src/server.js" ]