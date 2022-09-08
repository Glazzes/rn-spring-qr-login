FROM node:16-alpine
WORKDIR /app
COPY package*.json /app
COPY yarn.lock /app
RUN yarn install
RUN yarn global add expo-cli
COPY . .
ENTRYPOINT ["yarn", "run", "web"]
