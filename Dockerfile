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

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=openmrs:openmrs /app/spa .

# Switch to non-root user
USER openmrs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start serve in SPA mode
# -s = SPA mode (rewrites all requests to index.html for client-side routing)
# -l = listen port
CMD ["serve", "-s", ".", "-l", "3000"]
