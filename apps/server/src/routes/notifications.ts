import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth, type AuthVariables } from "../middleware/auth";
import { listNotifications, markAllRead, unreadCount, savePushToken } from "../services/notifications";

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

router.post(
  "/me/push-token",
  zValidator("json", z.object({ token: z.string() })),
  async (c) => {
    const { token } = c.req.valid("json");
    await savePushToken(c.get("userId"), token);
    return c.json({ ok: true });
  },
);

export default router;
