FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Installer les dépendances (layer séparé pour le cache Docker)
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

# Build du package shared
FROM deps AS builder
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
RUN pnpm --filter @mode/shared build

# Image de dev avec hot-reload
FROM deps AS development
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
ENV NODE_ENV=development
EXPOSE 3001
CMD ["pnpm", "--filter", "api", "dev"]
