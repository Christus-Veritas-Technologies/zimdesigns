import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth, type AuthVariables } from "../middleware/auth";
import { listComments, createComment, deleteComment } from "../services/comments";

const router = new Hono<{ Variables: AuthVariables }>();

router.get("/redesigns/:id/comments", async (c) => {
  const comments = await listComments(c.req.param("id"));
  return c.json(comments);
});

router.post(
  "/redesigns/:id/comments",
  requireAuth,
  zValidator("json", z.object({ body: z.string().min(1).max(1000) })),
  async (c) => {
    const { body } = c.req.valid("json");
    try {
      const comment = await createComment(c.req.param("id"), c.get("userId"), body);
      return c.json(comment, 201);
    } catch {
      return c.json({ message: "Redesign not found" }, 404);
    }
  },
);

router.delete("/comments/:id", requireAuth, async (c) => {
  try {
    await deleteComment(c.req.param("id"), c.get("userId"));
    return c.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "FORBIDDEN") return c.json({ message: "Forbidden" }, 403);
    return c.json({ message: "Not found" }, 404);
  }
});

export default router;
