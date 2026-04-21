FROM node:22-alpine AS builder

ARG VITE_OPENAI_API_KEY
ARG VITE_OPENAI_API_ENDPOINT
ARG VITE_LLM_MODEL_NAME
ARG VITE_HIDE_CHARTDB_CLOUD
ARG VITE_DISABLE_ANALYTICS
ARG VITE_API_URL

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN echo "VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}" > .env && \
    echo "VITE_OPENAI_API_ENDPOINT=${VITE_OPENAI_API_ENDPOINT}" >> .env && \
    echo "VITE_LLM_MODEL_NAME=${VITE_LLM_MODEL_NAME}" >> .env && \
    echo "VITE_HIDE_CHARTDB_CLOUD=${VITE_HIDE_CHARTDB_CLOUD}" >> .env && \
    echo "VITE_DISABLE_ANALYTICS=${VITE_DISABLE_ANALYTICS}" >> .env && \
    echo "VITE_API_URL=${VITE_API_URL}" >> .env

# Generate Prisma client for the build environment
RUN cd server && npx prisma generate

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

# Primero copiamos los archivos de dependencias
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/package-lock.json ./package-lock.json

# ¡IMPORTANTE!: Eliminamos el script prepare para evitar que Husky falle en producción, luego instalamos solo dependencias de producción
RUN npm pkg delete scripts.prepare && npm ci --omit=dev --ignore-scripts

# Finalmente copiamos el resto de los archivos compilados
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/server ./server
COPY --from=builder /usr/src/app/server/prisma.config.ts ./prisma.config.ts
COPY --from=builder /usr/src/app/bootstrap.ts ./bootstrap.ts
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client

# Aseguramos que el cliente de Prisma esté generado para el entorno de producción
RUN cd server && npx prisma generate

ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

# Sync DB, bootstrap missing data, and start server
CMD npx prisma db push --schema=server/prisma/schema.prisma --accept-data-loss && \
    npx tsx bootstrap.ts && \
    npx tsx server/src/index.ts