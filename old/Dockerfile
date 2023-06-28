FROM node:18

WORKDIR /src

COPY package.json /src/
RUN npm install
COPY . /src/

CMD ["npm", "run", "dev"]