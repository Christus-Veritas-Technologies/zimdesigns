import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth, optionalAuth, type AuthVariables } from "../middleware/auth";
import {
  listRedesigns,
  getRedesign,
  createRedesign,
  toggleUpvote,
  deleteRedesign,
} from "../services/redesigns";

const router = new Hono<{ Variables: AuthVariables }>();

router.get(
  "/redesigns",
  optionalAuth,
  zValidator(
    "query",
    z.object({
      tag: z.string().optional(),
      sort: z.enum(["recent", "top"]).optional(),
      cursor: z.string().optional(),
      limit: z.coerce.number().int().min(1).max(50).optional(),
    }),
  ),
  async (c) => {
    const filters = c.req.valid("query");
    const viewerId = c.get("userId");
    const result = await listRedesigns(filters, viewerId);
    return c.json(result);
  },
);

router.get("/redesigns/:id", optionalAuth, async (c) => {
  try {
    const r = await getRedesign(c.req.param("id"), c.get("userId"));
    return c.json(r);
  } catch {
    return c.json({ message: "Not found" }, 404);
  }
});

router.post("/redesigns", requireAuth, async (c) => {
  const body = await c.req.parseBody();

  const title = body["title"];
  const appName = body["appName"];
  const description = body["description"];
  const tagsRaw = body["tags"];
  const beforeFile = body["before"];
  const afterFile = body["after"];

  if (!title || !appName || !beforeFile || !afterFile) {
    return c.json({ message: "title, appName, before, and after are required" }, 400);
  }
  if (typeof title !== "string" || typeof appName !== "string") {
    return c.json({ message: "Invalid fields" }, 400);
  }
  if (!(beforeFile instanceof File) || !(afterFile instanceof File)) {
    return c.json({ message: "before and after must be image files" }, 400);
  }

  let tags: string[] = [];
  if (typeof tagsRaw === "string") {
    try {
      tags = JSON.parse(tagsRaw);
      if (!Array.isArray(tags)) tags = [];
    } catch {
      tags = [];
    }
  }

  try {
    const r = await createRedesign(c.get("userId"), {
      title,
      appName,
      description: typeof description === "string" ? description : undefined,
      tags,
      beforeFile,
      afterFile,
    });
    return c.json(r, 201);
  } catch (err) {
    console.error("createRedesign:", err);
    return c.json({ message: "Failed to create redesign" }, 500);
  }
});

router.post("/redesigns/:id/upvote", requireAuth, async (c) => {
  try {
    const result = await toggleUpvote(c.req.param("id"), c.get("userId"));
    return c.json(result);
  } catch {
    return c.json({ message: "Not found" }, 404);
  }
});

router.delete("/redesigns/:id", requireAuth, async (c) => {
  try {
    await deleteRedesign(c.req.param("id"), c.get("userId"));
    return c.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "FORBIDDEN") return c.json({ message: "Forbidden" }, 403);
    return c.json({ message: "Not found" }, 404);
  }
});

export default router;
