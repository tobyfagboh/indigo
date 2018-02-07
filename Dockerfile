FROM node:6.10.3 
FROM markadams/chromium-xvfb-js:7

RUN mkdir /src
RUN mkdir -p /src/Reports
WORKDIR /src

COPY package.json /src
RUN npm install
RUN npm install mocha mocha-bamboo-reporter -g
COPY . /src

CMD ["npm", "run", "test"]
