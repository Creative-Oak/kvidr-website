# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# kvidr.app — Astro in SSR mode, served by the standalone Node adapter.
#
# Astro inlines PUBLIC_* variables at BUILD time, so the build stage needs the
# Sanity project id and dataset. In Coolify, set those as build variables as
# well as runtime ones. Secrets (SANITY_API_READ_TOKEN, RESEND_API_KEY) are
# only ever read at runtime and must never be build args.
# ---------------------------------------------------------------------------

FROM node:22-alpine AS base
WORKDIR /app


# ---- full dependency tree, for building -----------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci


# ---- production-only dependency tree, for the runtime image ---------------
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev


# ---- build ----------------------------------------------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG PUBLIC_SANITY_PROJECT_ID
ARG PUBLIC_SANITY_DATASET=production
ARG PUBLIC_SITE_URL=https://kvidr.app
ARG PUBLIC_SANITY_VISUAL_EDITING_ENABLED=false
ARG PUBLIC_UMAMI_SCRIPT_URL=""
ARG PUBLIC_UMAMI_WEBSITE_ID=""

ENV PUBLIC_SANITY_PROJECT_ID=$PUBLIC_SANITY_PROJECT_ID \
    PUBLIC_SANITY_DATASET=$PUBLIC_SANITY_DATASET \
    PUBLIC_SITE_URL=$PUBLIC_SITE_URL \
    PUBLIC_SANITY_VISUAL_EDITING_ENABLED=$PUBLIC_SANITY_VISUAL_EDITING_ENABLED \
    PUBLIC_UMAMI_SCRIPT_URL=$PUBLIC_UMAMI_SCRIPT_URL \
    PUBLIC_UMAMI_WEBSITE_ID=$PUBLIC_UMAMI_WEBSITE_ID \
    NODE_ENV=production

RUN npm run build


# ---- runtime --------------------------------------------------------------
FROM base AS runtime
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./

USER node
EXPOSE 4321

# Checks that the server is up and serving, without depending on Sanity being
# reachable — a CMS blip should not restart the container.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||4321)+'/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "./dist/server/entry.mjs"]
