FROM node:10.5-alpine
USER root
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --production
COPY . .
EXPOSE 3070
CMD [ "npm", "start"]