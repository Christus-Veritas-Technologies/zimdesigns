import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth, type AuthVariables } from "../middleware/auth";
import { getMe, updateProfile, updateInterests, completeOnboarding } from "../services/onboarding";

const router = new Hono<{ Variables: AuthVariables }>();

router.use("/*", requireAuth);

router.get("/me", async (c) => {
  try {
    const user = await getMe(c.get("userId"));
    return c.json(user);
  } catch {
    return c.json({ message: "User not found" }, 404);
  }
});

router.patch(
  "/me",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1).max(100).optional(),
      username: z.string().min(2).max(30).regex(/^[a-z0-9_]+$/i).optional(),
      bio: z.string().max(160).optional(),
      role: z.enum(["designer", "developer", "both"]).optional(),
      avatarUrl: z.string().url().optional(),
    }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    try {
      const user = await updateProfile(c.get("userId"), data);
      return c.json(user);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "USERNAME_TAKEN") return c.json({ message: "That username is taken" }, 409);
      console.error("updateProfile:", err);
      return c.json({ message: "Internal server error" }, 500);
    }
  },
);

router.patch(
  "/me/interests",
  zValidator(
    "json",
    z.object({ interests: z.array(z.string()).max(20) }),
  ),
  async (c) => {
    const { interests } = c.req.valid("json");
    const user = await updateInterests(c.get("userId"), interests);
    return c.json(user);
  },
);

router.post("/me/onboarding/complete", async (c) => {
  const user = await completeOnboarding(c.get("userId"));
  return c.json(user);
});

export default router;
