FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npm run generate:swagger

EXPOSE 8080

CMD ["npm", "start"]
