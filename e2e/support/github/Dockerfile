# syntax=docker/dockerfile:1.3
FROM --platform=$BUILDPLATFORM node:20-alpine as dev

ARG APP_SHELL_VERSION=next

RUN mkdir -p /app
WORKDIR /app

COPY . .

ARG CACHE_BUST

RUN yarn install
RUN node packages/tooling/openmrs/dist/cli.js assemble --manifest --mode config --config spa-assemble-config.json --target /app/spa
RUN node packages/tooling/openmrs/dist/cli.js build --target /app/spa
RUN ls -al /app/spa

FROM --platform=$BUILDPLATFORM openmrs/openmrs-reference-application-3-frontend:nightly as frontend
# clear out the already installed files
RUN rm -rf /usr/share/nginx/html/*
# add our custom build
COPY --from=dev /app/spa/ /usr/share/nginx/html/
