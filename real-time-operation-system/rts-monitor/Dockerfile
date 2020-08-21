FROM node:10.16.0
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install pm2 -g

RUN npm install
COPY . .

ENV NODE_ENV production
EXPOSE 3008
CMD ["npm", "run", "start:pm2"]
