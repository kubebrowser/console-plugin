FROM registry.access.redhat.com/ubi9/nodejs-18:latest AS build
USER root

ADD . /usr/src/app
WORKDIR /usr/src/app
RUN npm install && npm run build

FROM registry.access.redhat.com/ubi9/nginx-120:latest

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
USER 1001

ENTRYPOINT ["nginx", "-g", "daemon off;"]