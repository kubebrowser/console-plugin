FROM registry.access.redhat.com/ubi9/nodejs-18:latest AS build
USER root

WORKDIR /usr/src/app

COPY package*.json . 
RUN npm install

COPY . ./
RUN npm run build

FROM registry.access.redhat.com/ubi9/nginx-120:latest

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/
USER 1001

ENTRYPOINT ["nginx", "-g", "daemon off;"]