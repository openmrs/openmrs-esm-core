# =============================================================================
# OpenMRS 3.x Frontend - Production Dockerfile
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build Stage
# -----------------------------------------------------------------------------
FROM --platform=$BUILDPLATFORM node:22-alpine AS builder

# Build arguments
ARG APP_SHELL_VERSION=next
ARG CACHE_BUST

# OpenMRS build-time environment variables (used by webpack)
# OMRS_API_URL - Set via build arg if backend is on different host
ARG OMRS_API_URL=https://api.emr.hubuk.ng/openmrs
ENV OMRS_API_URL=https://api.emr.hubuk.ng/openmrs
ENV OMRS_PUBLIC_PATH=/openmrs/spa
ENV OMRS_PAGE_TITLE=OpenMRS
ENV OMRS_OFFLINE=disable
ENV NODE_ENV=production

WORKDIR /app

# Copy package files first for better caching
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages ./packages
COPY turbo.json ./

# Install dependencies
RUN yarn install --immutable

# Build all packages
RUN yarn turbo run build

# Copy SPA assembly configuration
COPY spa-assemble-config.json ./

# Assemble the SPA
RUN node packages/tooling/openmrs/dist/cli.js assemble \
    --manifest \
    --mode config \
    --config spa-assemble-config.json \
    --target /app/spa

# Build the final application
RUN node packages/tooling/openmrs/dist/cli.js build \
    --target /app/spa

# -----------------------------------------------------------------------------
# Stage 2: Production Stage - nginx
# -----------------------------------------------------------------------------
FROM nginx:1.25-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/spa /usr/share/nginx/html/openmrs/spa

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/openmrs/spa/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
