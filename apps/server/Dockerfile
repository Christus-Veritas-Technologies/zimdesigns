FROM oven/bun:1

WORKDIR /app

COPY . .

RUN bun install

# Generate Prisma client before building
RUN cd packages/db && bunx prisma generate

RUN cd apps/server && bun run build

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["bun", "run", "dist/index.mjs"]