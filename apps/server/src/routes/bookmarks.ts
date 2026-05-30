import { Hono } from "hono";
import { requireAuth, type AuthVariables } from "../middleware/auth";
import { toggleBookmark, getBookmarkStatus, listBookmarks } from "../services/bookmarks";

const router = new Hono<{ Variables: AuthVariables }>();

router.use("/*", requireAuth);

router.get("/bookmarks", async (c) => {
  return c.json(await listBookmarks(c.get("userId")));
});

router.post("/redesigns/:id/bookmark", async (c) => {
  const result = await toggleBookmark(c.get("userId"), c.req.param("id"));
  return c.json(result);
});

router.get("/redesigns/:id/bookmark-status", async (c) => {
  return c.json(await getBookmarkStatus(c.get("userId"), c.req.param("id")));
});

export default router;
