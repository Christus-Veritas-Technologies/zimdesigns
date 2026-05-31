import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth, optionalAuth, type AuthVariables } from "../middleware/auth";
import { listAppRequests, createAppRequest, toggleAppRequestVote, getTrending } from "../services/app-requests";

const router = new Hono<{ Variables: AuthVariables }>();

router.get("/app-requests", optionalAuth, async (c) => {
  return c.json(await listAppRequests(c.get("userId")));
});

router.post(
  "/app-requests",
  requireAuth,
  zValidator("json", z.object({ appName: z.string().min(1).max(80), description: z.string().max(500).optional() })),
  async (c) => {
    const { appName, description } = c.req.valid("json");
    try {
      const r = await createAppRequest(c.get("userId"), appName, description);
      return c.json(r, 201);
    } catch (err) {
      if (err instanceof Error && err.message === "DUPLICATE")
        return c.json({ message: "An app request with that name already exists" }, 409);
      throw err;
    }
  },
);

router.post("/app-requests/:id/vote", requireAuth, async (c) => {
  const result = await toggleAppRequestVote(c.get("userId"), c.req.param("id"));
  return c.json(result);
});

router.get("/trending", async (c) => {
  return c.json(await getTrending());
});

export default router;
