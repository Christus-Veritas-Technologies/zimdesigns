# =========================
# Base image
# =========================
ARG NODE_VERSION=24.13.0-slim
FROM node:${NODE_VERSION} AS base

WORKDIR /app

# Enable corepack (pnpm manager)
RUN corepack enable

# =========================
# Dependencies stage
# =========================
FROM base AS deps

# Copy only dependency manifests first (monorepo safe)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./

# If you use catalog:* (you do), ensure pnpm respects it
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN pnpm install --frozen-lockfile

# =========================
# Build stage
# =========================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

# Build Next.js app
RUN pnpm build

# =========================
# Runtime stage (Next standalone)
# =========================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN useradd -m nextjs

# Copy standalone output (IMPORTANT for Next 16)
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nextjs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]