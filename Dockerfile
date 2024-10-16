FROM node:20

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
EXPOSE 4200