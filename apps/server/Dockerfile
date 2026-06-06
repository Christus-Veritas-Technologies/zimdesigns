FROM oven/bun:1

WORKDIR /app

COPY . .

RUN bun install

# Change this — run build from within the server app directory
RUN cd apps/server && bun run build

WORKDIR /app/apps/server

EXPOSE 3000

# This is fine since WORKDIR is already /app/apps/server
CMD ["bun", "run", "dist/index.mjs"]