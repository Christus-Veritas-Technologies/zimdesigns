import { env } from "@zimdesigns/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import authRoutes from "./routes/auth";
import onboardingRoutes from "./routes/onboarding";
import redesignRoutes from "./routes/redesigns";
import commentRoutes from "./routes/comments";
import notificationRoutes from "./routes/notifications";
import profileRoutes from "./routes/profiles";
import followRoutes from "./routes/follows";
import bookmarkRoutes from "./routes/bookmarks";
import appRequestRoutes from "./routes/app-requests";
import settingsRoutes from "./routes/settings";
import appEntryRoutes from "./routes/app-entries";
import discoverRoutes from "./routes/discover";
import adminRoutes from "./routes/admin";
import reportRoutes from "./routes/reports";

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

app.route("/api/auth", authRoutes);
app.route("/api", onboardingRoutes);
app.route("/api", redesignRoutes);
app.route("/api", commentRoutes);
app.route("/api", notificationRoutes);
app.route("/api", profileRoutes);
app.route("/api", followRoutes);
app.route("/api", bookmarkRoutes);
app.route("/api", appRequestRoutes);
app.route("/api", settingsRoutes);
app.route("/api/apps", appEntryRoutes);
app.route("/api/discover", discoverRoutes);
app.route("/api/admin", adminRoutes);
app.route("/api", reportRoutes);

export default app;
