FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Installer les dépendances
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile

# Build du package shared
FROM deps AS builder
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
RUN pnpm --filter @mode/shared build

# Image de dev avec hot-reload Next.js
FROM deps AS development
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web
ENV NODE_ENV=development
EXPOSE 3000
CMD ["pnpm", "--filter", "web", "dev"]
