FROM oven/bun:1

WORKDIR /app

COPY . .

RUN bun install

RUN bunx turbo run build --filter=server

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["bun", "run", "apps/server/dist/index.mjs"]