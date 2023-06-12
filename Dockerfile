FROM node:lts-bullseye-slim

WORKDIR /user/src/app

COPY package*.json ./

USER app

RUN ci --omit=dev

COPY src ./src

RUN npm run build

EXPOSE 5000

CMD ["node", "build/index.js"]