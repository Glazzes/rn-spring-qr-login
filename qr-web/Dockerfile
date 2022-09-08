FROM node:16-alpine
WORKDIR /app
COPY * .
RUN ["npm", "install"]
ENTRYPOINT ["npx", "expo", "start", "--web"]