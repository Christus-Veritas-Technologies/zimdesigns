FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter web build

FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY --from=builder /app .

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["pnpm", "start"]