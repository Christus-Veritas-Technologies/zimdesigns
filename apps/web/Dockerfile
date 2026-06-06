FROM node:22-slim AS builder

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter web build

FROM node:22-slim AS runner

WORKDIR /app

RUN corepack enable

# Copy the full workspace structure needed for pnpm to resolve correctly
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/packages ./packages

WORKDIR /app/apps/web

EXPOSE 3001

CMD ["pnpm", "start"]