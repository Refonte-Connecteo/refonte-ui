# =============================================================================
# Site Connecteo (Next.js) — image multi-étapes, sortie « standalone »
# NEXT_PUBLIC_API_URL est lue par le navigateur : elle est figée au build.
# =============================================================================

FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
# Cache npm conservé entre deux builds : une connexion coupée ne fait pas tout retélécharger.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost:3000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_OUTPUT_STANDALONE=1 \
    NEXT_IMAGES_UNOPTIMIZED=1

RUN npm run build

# --- Production ---------------------------------------------------------------
FROM node:22-slim AS runtime

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3001 \
    HOSTNAME=0.0.0.0

WORKDIR /app

# Le serveur minimal ne sert ni public/ ni .next/static : on les recopie à côté de lui.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node

EXPOSE 3001

CMD ["node", "server.js"]
