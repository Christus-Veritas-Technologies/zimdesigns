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

// Accepts multipart/form-data so clients can upload an avatar file alongside text fields
router.patch("/me", async (c) => {
  const contentType = c.req.header("Content-Type") ?? "";
  let data: Record<string, string | File | undefined> = {};

  if (contentType.includes("multipart/form-data")) {
    data = await c.req.parseBody() as Record<string, string | File | undefined>;
  } else {
    const json = await c.req.json().catch(() => ({}));
    data = json;
  }

  const optUrl = z.string().url().optional().or(z.literal(""));

  const parsed = z.object({
    name: z.string().min(1).max(100).optional(),
    username: z.string().min(2).max(30).regex(/^[a-z0-9_]+$/i).optional(),
    bio: z.string().max(160).optional(),
    role: z.enum(["designer", "developer", "both"]).optional(),
    linkedinUrl: optUrl,
    githubUrl: optUrl,
    dribbbleUrl: optUrl,
    twitterUrl: optUrl,
    websiteUrl: optUrl,
  }).safeParse({
    name: typeof data.name === "string" ? data.name : undefined,
    username: typeof data.username === "string" ? data.username : undefined,
    bio: typeof data.bio === "string" ? data.bio : undefined,
    role: typeof data.role === "string" ? data.role : undefined,
    linkedinUrl: typeof data.linkedinUrl === "string" ? data.linkedinUrl : undefined,
    githubUrl: typeof data.githubUrl === "string" ? data.githubUrl : undefined,
    dribbbleUrl: typeof data.dribbbleUrl === "string" ? data.dribbbleUrl : undefined,
    twitterUrl: typeof data.twitterUrl === "string" ? data.twitterUrl : undefined,
    websiteUrl: typeof data.websiteUrl === "string" ? data.websiteUrl : undefined,
  });

  if (!parsed.success) {
    return c.json({ message: "Invalid fields", errors: parsed.error.flatten() }, 400);
  }

  const avatarFile = data.avatar instanceof File ? data.avatar : undefined;

  try {
    const user = await updateProfile(c.get("userId"), { ...parsed.data, avatarFile });
    return c.json(user);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "USERNAME_TAKEN") return c.json({ message: "That username is taken" }, 409);
    console.error("updateProfile:", err);
    return c.json({ message: "Internal server error" }, 500);
  }
});

router.patch(
  "/me/interests",
  zValidator("json", z.object({ interests: z.array(z.string()).max(20) })),
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
