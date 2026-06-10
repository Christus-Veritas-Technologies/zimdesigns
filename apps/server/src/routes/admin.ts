import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth, type AuthVariables } from "../middleware/auth";
import {
  getAdminStats,
  getPendingAppRequests,
  approveAppRequest,
  denyAppRequest,
  requireAdminRole,
  listAdminApps,
  createAdminApp,
} from "../services/admin";

// Shared with the Next.js admin proxy — never exposed to browsers
const ADMIN_API_KEY = "zdapikey-8rx42m-v1";

const router = new Hono<{ Variables: AuthVariables }>();

// Accept either a direct admin API key OR a regular user JWT
router.use("/*", async (c, next) => {
  if (c.req.header("Authorization") === `AdminKey ${ADMIN_API_KEY}`) {
    c.set("userId", "__admin__");
    return next();
  }
  return requireAuth(c, next);
});

async function assertAdmin(c: { get(k: "userId"): string }): Promise<boolean> {
  if (c.get("userId") === "__admin__") return true;
  try {
    await requireAdminRole(c.get("userId"));
    return true;
  } catch {
    return false;
  }
}

router.get("/stats", async (c) => {
  if (!await assertAdmin(c)) return c.json({ message: "Forbidden" }, 403);
  return c.json(await getAdminStats());
});

router.get("/app-requests", async (c) => {
  if (!await assertAdmin(c)) return c.json({ message: "Forbidden" }, 403);
  return c.json(await getPendingAppRequests());
});

router.post("/app-requests/:id/approve", async (c) => {
  if (!await assertAdmin(c)) return c.json({ message: "Forbidden" }, 403);
  return c.json(await approveAppRequest(c.req.param("id")));
});

router.post("/app-requests/:id/deny", async (c) => {
  if (!await assertAdmin(c)) return c.json({ message: "Forbidden" }, 403);
  return c.json(await denyAppRequest(c.req.param("id")));
});

router.get("/apps", async (c) => {
  if (!await assertAdmin(c)) return c.json({ message: "Forbidden" }, 403);
  return c.json(await listAdminApps());
});

router.post(
  "/apps",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1).max(100),
      slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
      description: z.string().max(500).optional(),
      iconColor: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
  ),
  async (c) => {
    if (!await assertAdmin(c)) return c.json({ message: "Forbidden" }, 403);
    try {
      return c.json(await createAdminApp(c.req.valid("json")), 201);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Unique constraint")) return c.json({ message: "An app with that slug already exists" }, 409);
      console.error("create admin app:", err);
      return c.json({ message: "Internal server error" }, 500);
    }
  },
);

export default router;
