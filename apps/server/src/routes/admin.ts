import { Hono } from "hono";
import { requireAuth, type AuthVariables } from "../middleware/auth";
import {
  getAdminStats,
  getPendingAppRequests,
  approveAppRequest,
  denyAppRequest,
  requireAdminRole,
} from "../services/admin";

const router = new Hono<{ Variables: AuthVariables }>();

router.use("/*", requireAuth);

router.get("/stats", async (c) => {
  try {
    await requireAdminRole(c.get("userId"));
  } catch {
    return c.json({ message: "Forbidden" }, 403);
  }
  return c.json(await getAdminStats());
});

router.get("/app-requests", async (c) => {
  try {
    await requireAdminRole(c.get("userId"));
  } catch {
    return c.json({ message: "Forbidden" }, 403);
  }
  return c.json(await getPendingAppRequests());
});

router.post("/app-requests/:id/approve", async (c) => {
  try {
    await requireAdminRole(c.get("userId"));
  } catch {
    return c.json({ message: "Forbidden" }, 403);
  }
  return c.json(await approveAppRequest(c.req.param("id")));
});

router.post("/app-requests/:id/deny", async (c) => {
  try {
    await requireAdminRole(c.get("userId"));
  } catch {
    return c.json({ message: "Forbidden" }, 403);
  }
  return c.json(await denyAppRequest(c.req.param("id")));
});

export default router;
