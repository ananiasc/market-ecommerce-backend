# Etapa 1: Build da aplicação NestJS
FROM node:18.20.7 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Imagem final apenas com o necessário para rodar o NestJS
FROM node:18.20.7

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json /app/package-lock.json ./

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/main.js"]
