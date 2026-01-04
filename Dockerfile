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

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Copy workspace packages
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
# Stage 2: Production Stage - Lightweight static server
# -----------------------------------------------------------------------------
FROM node:22-alpine AS production

# Install serve globally
RUN npm install -g serve@14

# Create non-root user for security
RUN addgroup -g 1001 -S openmrs && \
    adduser -S -D -H -u 1001 -s /sbin/nologin -G openmrs openmrs

# Set working directory - serve from root to maintain /openmrs/spa path
WORKDIR /app

# Create the expected directory structure: /app/openmrs/spa/
# This ensures assets are served at /openmrs/spa/* as the build expects
RUN mkdir -p /app/openmrs/spa

# Copy built application to the correct path
COPY --from=builder --chown=openmrs:openmrs /app/spa /app/openmrs/spa

# Copy serve configuration for SPA routing
COPY --chown=openmrs:openmrs serve.json ./

# Switch to non-root user
USER openmrs

# Expose port
EXPOSE 3000

# Health check - check the actual path
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/openmrs/spa/ || exit 1

# Start serve with config file (handles SPA routing for /openmrs/spa/*)
CMD ["serve", "-c", "serve.json", "-l", "3000"]
