FROM node:lts-alpine

WORKDIR /app

# append node_modules to PATH
ENV PATH /app/node_modules/.bin:$PATH

CMD npm run start || npm ci && npm run start
