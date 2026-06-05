FROM node:22-slim AS builder

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter web build


FROM node:22-slim AS runner

WORKDIR /app

RUN corepack enable

COPY --from=builder /app/apps/web/.next /app/apps/web/.next
COPY --from=builder /app/apps/web/public /app/apps/web/public
COPY --from=builder /app/apps/web/package.json /app/apps/web/package.json

COPY --from=builder /app/node_modules /app/node_modules

WORKDIR /app/apps/web

EXPOSE 3001

CMD ["pnpm", "start"]