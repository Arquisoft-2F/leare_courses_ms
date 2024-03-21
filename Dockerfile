FROM node:20 as builder

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY . .

RUN npm i --include=dev

RUN npm run build

FROM node:20

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/package-lock.json ./
COPY --from=builder /usr/src/app/.env ./
COPY --from=builder /usr/src/app/dist/. ./

RUN npm ci --production

EXPOSE 3003

CMD [ "node", "./index.js" ]
