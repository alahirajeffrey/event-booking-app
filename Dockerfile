FROM node:lts-bullseye-slim

WORKDIR /user/event_booking_app

COPY package*.json ./

RUN ci --omit=dev

COPY src ./src

RUN npm run build

USER node

CMD ["node", "build/index.js"]