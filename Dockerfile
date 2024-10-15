FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 4200