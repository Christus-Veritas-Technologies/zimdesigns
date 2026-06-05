FROM oven/bun:1

WORKDIR /app

COPY . .

RUN bun install

RUN bun --cwd apps/server run build

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["bun", "run", "start"]