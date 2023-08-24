FROM node:18-alpine

WORKDIR /user/notification_microservice

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build

USER node

CMD ["npm", "run", "start:prod"]