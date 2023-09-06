# syntax=docker/dockerfile:1.3
FROM --platform=$BUILDPLATFORM node:18-alpine as dev

ARG APP_SHELL_VERSION=next

RUN mkdir -p /app
WORKDIR /app

COPY . .

RUN npm_config_legacy_peer_deps=true npm install -g openmrs@${APP_SHELL_VERSION:-next}
ARG CACHE_BUST
RUN npm_config_legacy_peer_deps=true openmrs assemble --manifest --mode config --config spa-assemble-config.json --target ./spa

FROM --platform=$BUILDPLATFORM openmrs/openmrs-reference-application-3-frontend:nightly as frontend
FROM nginx:1.23-alpine

RUN apk update && \
  apk upgrade && \
  # add more utils for sponge to support our startup script
  apk add --no-cache moreutils

# clear any default files installed by nginx
RUN rm -rf /usr/share/nginx/html/*

COPY --from=frontend /etc/nginx/nginx.conf /etc/nginx/nginx.conf
# this assumes that NOTHING in the framework is in a subdirectory
COPY --from=frontend /usr/share/nginx/html/* /usr/share/nginx/html/
COPY --from=frontend /usr/local/bin/startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

COPY --from=dev /app/spa/ /usr/share/nginx/html/

CMD ["/usr/local/bin/startup.sh"]
