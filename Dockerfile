FROM node:15-alpine
WORKDIR /myapp
COPY ./package*.json ./
COPY ./yarn.lock ./
RUN yarn install
COPY . .

RUN yarn build

EXPOSE 8000

CMD ["yarn", "start"]
