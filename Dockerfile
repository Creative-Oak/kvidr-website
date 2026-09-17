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
ARG PUBLIC_SHOW_PRICING=false

ENV PUBLIC_SANITY_PROJECT_ID=$PUBLIC_SANITY_PROJECT_ID \
    PUBLIC_SANITY_DATASET=$PUBLIC_SANITY_DATASET \
    PUBLIC_SITE_URL=$PUBLIC_SITE_URL \
    PUBLIC_SHOW_PRICING=$PUBLIC_SHOW_PRICING \
    PUBLIC_SANITY_VISUAL_EDITING_ENABLED=$PUBLIC_SANITY_VISUAL_EDITING_ENABLED \
    PUBLIC_UMAMI_SCRIPT_URL=$PUBLIC_UMAMI_SCRIPT_URL \
    PUBLIC_UMAMI_WEBSITE_ID=$PUBLIC_UMAMI_WEBSITE_ID \
    NODE_ENV=production

# `build` also runs verify:runtime, which fails loudly if anything escapes
# the server bundle that the runtime stage below would not ship.
RUN npm run build


# ---- runtime --------------------------------------------------------------
FROM base AS runtime
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# The server is built with ssr.noExternal, so dist/ carries its own
# dependencies. Only picomatch refuses to bundle, so that is all the runtime
# needs — a few hundred kilobytes instead of the whole installed tree, most of
# which is the Studio's client-side bundle and is already inside dist/client.
# scripts/check-runtime-externals.mjs fails the build if that stops being true.
COPY --from=build --chown=node:node /app/node_modules/picomatch ./node_modules/picomatch
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./

USER node
EXPOSE 3000

# Checks that the server is up and serving, without depending on Sanity being
# reachable — a CMS blip should not restart the container.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "./dist/server/entry.mjs"]
