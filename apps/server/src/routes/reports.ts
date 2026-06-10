import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth, type AuthVariables } from "../middleware/auth";
import db from "@zimdesigns/db";

const router = new Hono<{ Variables: AuthVariables }>();

router.post(
  "/reports",
  requireAuth,
  zValidator(
    "json",
    z.object({
      targetType: z.enum(["user", "redesign"]),
      targetId: z.string().min(1),
      reason: z.string().min(1).max(500),
    }),
  ),
  async (c) => {
    const { targetType, targetId, reason } = c.req.valid("json");
    const reporterId = c.get("userId");

    // Prevent duplicate open reports from same user for same target
    const existing = await db.report.findFirst({
      where: { reporterId, targetType, targetId, status: "open" },
    });
    if (existing) return c.json({ ok: true }); // silently deduplicate

    await db.report.create({ data: { reporterId, targetType, targetId, reason } });
    return c.json({ ok: true }, 201);
  },
);

export default router;
