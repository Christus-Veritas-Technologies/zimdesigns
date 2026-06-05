# =========================
# Base image
# =========================
ARG NODE_VERSION=24.13.0-slim
FROM node:${NODE_VERSION} AS base

# ✅ Fix: prevent pnpm interactive prompts in CI/Docker
ENV CI=true
ENV PNPM_CONFIG_CONFIRM_MODULES_PURGE=false

WORKDIR /app

# Enable Corepack (pnpm manager)
RUN corepack enable

# (Optional but recommended stability fix)
# Prevents pnpm version drift between builds
RUN corepack prepare pnpm@11.4.0 --activate


# =========================
# Dependencies stage
# =========================
FROM base AS deps

ENV CI=true
ENV PNPM_CONFIG_CONFIRM_MODULES_PURGE=false

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN pnpm install --frozen-lockfile


# =========================
# Build stage
# =========================
FROM base AS builder

ENV CI=true
ENV PNPM_CONFIG_CONFIRM_MODULES_PURGE=false
ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build


# =========================
# Runtime stage (Next standalone)
# =========================
FROM base AS runner

ENV CI=true
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /app

RUN useradd -m nextjs

# Copy Next standalone output
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]