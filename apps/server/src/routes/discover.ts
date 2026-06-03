import { Hono } from "hono";
import { getFeaturedCollections, getActiveChallenges } from "../services/discover";

const router = new Hono();

router.get("/collections", async (c) => {
  const collections = await getFeaturedCollections();
  return c.json(collections);
});

router.get("/challenges", async (c) => {
  const challenges = await getActiveChallenges();
  return c.json(challenges);
});

export default router;
