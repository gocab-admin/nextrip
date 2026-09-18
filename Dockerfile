FROM node:latest
WORKDIR /boatstar
COPY package*.json ./
RUN npm install
COPY . .
#RUN npm run build
#EXPOSE 3046
#CMD ["npm","start"]