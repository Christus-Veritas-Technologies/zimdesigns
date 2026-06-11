# Build from the monorepo root:
#   docker build -f apps/hosts-site/Dockerfile \
#     --build-arg NEXT_PUBLIC_APP_URL=https://hosts.christusveritas.tech \
#     --build-arg NEXT_PUBLIC_WHATSAPP_NUMBER=27000000000 \
#     -t hosts-site:latest .
#
# Run:
#   docker run -p 4321:4321 \
#     -e DATABASE_URL=postgresql://user:pass@host:5432/db \
#     -e NEXT_PUBLIC_APP_URL=https://hosts.christusveritas.tech \
#     -e NEXT_PUBLIC_WHATSAPP_NUMBER=27000000000 \
#     hosts-site:latest

# ---- Stage 1: builder ----
FROM node:22-slim AS builder

WORKDIR /app

# pnpm via corepack (version locked to packageManager field in root package.json)
RUN corepack enable

# Workspace root manifests — needed for pnpm to resolve the workspace graph
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Only the packages this app depends on at build time
COPY packages/config ./packages/config

# The app itself
COPY apps/hosts-site ./apps/hosts-site

# Install all workspace dependencies (frozen — no lockfile drift in CI)
RUN pnpm install --frozen-lockfile

# ---- Build-time env vars ----
# DATABASE_URL: only used by prisma generate (no live DB connection needed).
#   A syntactically valid placeholder is sufficient here; the real URL is
#   injected at runtime via docker run -e DATABASE_URL=...
ARG DATABASE_URL=postgresql://builder:builder@localhost:5432/builder
# NEXT_PUBLIC_* values are baked into the client bundle — pass real values.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_WHATSAPP_NUMBER

ENV DATABASE_URL=$DATABASE_URL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER \
    NODE_ENV=production

# Generate the Prisma client from the schema (no DB connection, types only)
RUN pnpm --filter hosts-site db:generate

# Build Next.js (produces .next/standalone + .next/static)
RUN pnpm --filter hosts-site build

# ---- Stage 2: runner ----
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=4321 \
    HOSTNAME=0.0.0.0

# Least-privilege: run as a non-root system user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 --ingroup nodejs nextjs

# Standalone output is self-contained: it has its own node_modules and server.js.
# outputFileTracingRoot=../../ means Next.js mirrors the monorepo layout inside
# standalone/, so the entry point is apps/hosts-site/server.js relative to here.
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-site/.next/standalone ./

# Static assets are not included in standalone — copy them into the expected path
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-site/.next/static \
     ./apps/hosts-site/.next/static

# Public directory (favicons, robots.txt, og images, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-site/public \
     ./apps/hosts-site/public

USER nextjs

EXPOSE 4321

CMD ["node", "apps/hosts-site/server.js"]
