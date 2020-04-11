FROM node:12-alpine


WORKDIR /usr/src/app
COPY package.json .
RUN npm install
ADD . /usr/src/app
RUN npm run build
CMD [ "npm", "run", "watch" ]
