import { env } from "@zimdesigns/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { readFile } from "fs/promises";
import { join } from "path";
import authRoutes from "./routes/auth";
import onboardingRoutes from "./routes/onboarding";
import redesignRoutes from "./routes/redesigns";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (c) => c.text("OK"));

app.get("/uploads/:filename", async (c) => {
  const filename = c.req.param("filename");
  if (filename.includes("..") || filename.includes("/")) {
    return c.json({ message: "Invalid filename" }, 400);
  }
  try {
    const buf = await readFile(join(process.cwd(), "uploads", filename));
    const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
    const mime = ext === "png" ? "image/png" : ext === "gif" ? "image/gif" : ext === "webp" ? "image/webp" : "image/jpeg";
    return new Response(buf, { headers: { "Content-Type": mime, "Cache-Control": "public, max-age=31536000" } });
  } catch {
    return c.json({ message: "Not found" }, 404);
  }
});

app.route("/api/auth", authRoutes);
app.route("/api", onboardingRoutes);
app.route("/api", redesignRoutes);

export default app;
