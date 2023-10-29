FROM node:lts-alpine

WORKDIR ./

COPY package.json .

RUN yarn install --frozen-lockfile

COPY . .

CMD [ "node", "src/server.ts" ]