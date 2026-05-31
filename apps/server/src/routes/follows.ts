import { Hono } from "hono";
import { requireAuth, optionalAuth, type AuthVariables } from "../middleware/auth";
import { toggleFollow, getFollowStatus, getFollowers, getFollowing, getFollowingFeed } from "../services/follows";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const router = new Hono<{ Variables: AuthVariables }>();

router.post("/users/:username/follow", requireAuth, async (c) => {
  const target = await import("@zimdesigns/db").then((m) =>
    m.default.user.findUnique({ where: { username: c.req.param("username") }, select: { id: true } }),
  );
  if (!target) return c.json({ message: "User not found" }, 404);
  try {
    const result = await toggleFollow(c.get("userId"), target.id);
    return c.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === "SELF_FOLLOW")
      return c.json({ message: "Cannot follow yourself" }, 400);
    throw err;
  }
});

router.get("/users/:username/follow-status", optionalAuth, async (c) => {
  const viewerId = c.get("userId");
  if (!viewerId) return c.json({ following: false });
  const target = await import("@zimdesigns/db").then((m) =>
    m.default.user.findUnique({ where: { username: c.req.param("username") }, select: { id: true } }),
  );
  if (!target) return c.json({ following: false });
  return c.json(await getFollowStatus(viewerId, target.id));
});

router.get("/users/:username/followers", async (c) => {
  try {
    return c.json(await getFollowers(c.req.param("username")));
  } catch {
    return c.json({ message: "Not found" }, 404);
  }
});

router.get("/users/:username/following", async (c) => {
  try {
    return c.json(await getFollowing(c.req.param("username")));
  } catch {
    return c.json({ message: "Not found" }, 404);
  }
});

router.get(
  "/feed/following",
  requireAuth,
  zValidator("query", z.object({ cursor: z.string().optional(), limit: z.coerce.number().int().min(1).max(50).optional() })),
  async (c) => {
    const { cursor, limit } = c.req.valid("query");
    return c.json(await getFollowingFeed(c.get("userId"), cursor, limit));
  },
);

export default router;
