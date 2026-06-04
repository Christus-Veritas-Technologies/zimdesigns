import { Hono } from "hono";
import { getFeaturedCollections, getActiveChallenges, getCollectionById } from "../services/discover";

const router = new Hono();

router.get("/collections", async (c) => {
  const collections = await getFeaturedCollections();
  return c.json(collections);
});

router.get("/collections/:id", async (c) => {
  const collection = await getCollectionById(c.req.param("id"));
  if (!collection) return c.json({ message: "Not found" }, 404);
  return c.json(collection);
});

router.get("/challenges", async (c) => {
  const challenges = await getActiveChallenges();
  return c.json(challenges);
});

export default router;
