FROM node:18

WORKDIR /app/src

COPY package.json /app/src/
RUN npm install
COPY . /app/src/

CMD ["npm", "run", "dev"]