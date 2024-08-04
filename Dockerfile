FROM node:20.13.1

ARG PORT=3000

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=$PORT

EXPOSE $PORT

CMD ["npm", "start"]