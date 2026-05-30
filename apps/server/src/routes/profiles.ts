import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getProfile, getUserRedesigns, searchRedesigns } from "../services/profiles";

const router = new Hono();

router.get(
  "/search",
  zValidator("query", z.object({ q: z.string().min(1).max(100) })),
  async (c) => {
    const { q } = c.req.valid("query");
    const results = await searchRedesigns(q);
    return c.json(results);
  },
);

router.get("/users/:username", async (c) => {
  try {
    const profile = await getProfile(c.req.param("username"));
    return c.json(profile);
  } catch {
    return c.json({ message: "User not found" }, 404);
  }
});

router.get("/users/:username/redesigns", async (c) => {
  try {
    const redesigns = await getUserRedesigns(c.req.param("username"));
    return c.json(redesigns);
  } catch {
    return c.json({ message: "User not found" }, 404);
  }
});

export default router;
