import { Hono } from "hono";
import { requireAuth, type AuthVariables } from "../middleware/auth";
import { listNotifications, markAllRead, unreadCount } from "../services/notifications";

const router = new Hono<{ Variables: AuthVariables }>();

router.use("/*", requireAuth);

router.get("/notifications", async (c) => {
  const notifications = await listNotifications(c.get("userId"));
  return c.json(notifications);
});

router.get("/notifications/unread-count", async (c) => {
  const count = await unreadCount(c.get("userId"));
  return c.json({ count });
});

router.post("/notifications/read-all", async (c) => {
  await markAllRead(c.get("userId"));
  return c.json({ ok: true });
});

export default router;
