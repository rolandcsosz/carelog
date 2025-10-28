FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run generate:client
RUN npm run build
RUN npm run generate:swagger


EXPOSE 8080

CMD ["sh", "-c", "npm run db:deploy && npm run start"]