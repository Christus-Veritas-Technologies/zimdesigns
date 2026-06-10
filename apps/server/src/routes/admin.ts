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
import {
  listAdminUsers,
  banUser,
  unbanUser,
  listAdminReports,
  resolveReport,
  dismissReport,
} from "../services/admin-users";

// Shared with the Next.js admin proxy — never exposed to browsers
const ADMIN_API_KEY = "zdapikey-8rx42m-v1";

const router = new Hono<{ Variables: AuthVariables }>();

// Accept either:
//   X-Admin-Key header (set by the Next.js proxy after verifying the admin cookie)
//   Authorization: AdminKey <key> (legacy/direct)
//   Authorization: Bearer <jwt> with admin DB role
router.use("/*", async (c, next) => {
  const xAdminKey = c.req.header("X-Admin-Key");
  const authHeader = c.req.header("Authorization");

  if (xAdminKey === ADMIN_API_KEY || authHeader === `AdminKey ${ADMIN_API_KEY}`) {
    // Trusted proxy path — try to resolve the real user from JWT if forwarded
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const { verifyJwt } = await import("../lib/jwt");
        const payload = await verifyJwt(authHeader.slice(7), "access");
        c.set("userId", payload.userId);
      } catch {
        c.set("userId", "__admin__");
      }
    } else {
      c.set("userId", "__admin__");
    }
    return next();
  }

  return requireAuth(c, next);
});

async function assertAdmin(c: { get(k: "userId"): string; req: { header(k: string): string | undefined } }): Promise<boolean> {
  // Requests forwarded by the Next.js proxy are pre-authorised by the admin password check
  if (c.req.header("X-Admin-Key") === ADMIN_API_KEY) return true;
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

// ── Users ─────────────────────────────────────────────────────────────────────

router.get("/users", async (c) => {
  if (!await assertAdmin(c)) return c.json({ message: "Forbidden" }, 403);
  const { page, limit, search } = c.req.query();
  return c.json(await listAdminUsers({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search: search || undefined,
  }));
});

router.post("/users/:id/ban", async (c) => {
  if (!await assertAdmin(c)) return c.json({ message: "Forbidden" }, 403);
  return c.json(await banUser(c.req.param("id")));
});

router.post("/users/:id/unban", async (c) => {
  if (!await assertAdmin(c)) return c.json({ message: "Forbidden" }, 403);
  return c.json(await unbanUser(c.req.param("id")));
});

// ── Reports ───────────────────────────────────────────────────────────────────

router.get("/reports", async (c) => {
  if (!await assertAdmin(c)) return c.json({ message: "Forbidden" }, 403);
  const status = c.req.query("status") || undefined;
  return c.json(await listAdminReports({ status }));
});

router.post("/reports/:id/resolve", async (c) => {
  if (!await assertAdmin(c)) return c.json({ message: "Forbidden" }, 403);
  return c.json(await resolveReport(c.req.param("id")));
});

router.post("/reports/:id/dismiss", async (c) => {
  if (!await assertAdmin(c)) return c.json({ message: "Forbidden" }, 403);
  return c.json(await dismissReport(c.req.param("id")));
});

// ── Apps ──────────────────────────────────────────────────────────────────────

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
