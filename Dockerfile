FROM node:22-alpine AS builder

ARG VITE_OPENAI_API_KEY
ARG VITE_OPENAI_API_ENDPOINT
ARG VITE_LLM_MODEL_NAME
ARG VITE_HIDE_CHARTDB_CLOUD
ARG VITE_DISABLE_ANALYTICS

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN echo "VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}" > .env && \
    echo "VITE_OPENAI_API_ENDPOINT=${VITE_OPENAI_API_ENDPOINT}" >> .env && \
    echo "VITE_LLM_MODEL_NAME=${VITE_LLM_MODEL_NAME}" >> .env && \
    echo "VITE_HIDE_CHARTDB_CLOUD=${VITE_HIDE_CHARTDB_CLOUD}" >> .env && \
    echo "VITE_DISABLE_ANALYTICS=${VITE_DISABLE_ANALYTICS}" >> .env

# Generate Prisma client for the build environment
RUN cd server && npx prisma generate

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /usr/src/app

# ¡IMPORTANTE!: Instalamos solo dependencias de producción
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/server ./server
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/package-lock.json ./package-lock.json
COPY --from=builder /usr/src/app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /usr/src/app/bootstrap.ts ./bootstrap.ts

ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

# Sync DB, bootstrap missing data, and start server
CMD npx prisma db push --schema=server/prisma/schema.prisma --accept-data-loss && \
    node bootstrap.ts && \
    node server/src/index.ts