FROM node:15-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY *.js ./

EXPOSE 4000

CMD npm start
