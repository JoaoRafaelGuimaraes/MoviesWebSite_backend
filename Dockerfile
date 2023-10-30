# Etapa de construção
FROM node:lts-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Copie o arquivo .env para o contêiner
COPY .env ./

COPY . .
RUN yarn tsc

# Etapa de produção
FROM node:lts-alpine

WORKDIR /app

# Copie apenas as dependências necessárias para produção
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copie o código compilado da etapa de construção
COPY --from=build /app/dist ./dist

# Opcional: Exponha a porta que seu aplicativo estará ouvindo
EXPOSE 8080

CMD [ "node", "dist/server.js" ]