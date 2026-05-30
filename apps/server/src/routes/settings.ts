import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth, type AuthVariables } from "../middleware/auth";
import { hashPassword, verifyPassword } from "../lib/password";
import db from "@zimdesigns/db";

const router = new Hono<{ Variables: AuthVariables }>();

router.use("/*", requireAuth);

router.post(
  "/settings/change-password",
  zValidator("json", z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8) })),
  async (c) => {
    const { currentPassword, newPassword } = c.req.valid("json");
    const user = await db.user.findUniqueOrThrow({ where: { id: c.get("userId") } });

    if (!user.passwordHash) {
      return c.json({ message: "This account uses Google sign-in and has no password" }, 400);
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) return c.json({ message: "Current password is incorrect" }, 401);

    const newHash = await hashPassword(newPassword);
    await db.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
    await db.refreshToken.deleteMany({ where: { userId: user.id } });

    return c.json({ ok: true });
  },
);

router.delete("/settings/account", async (c) => {
  await db.user.delete({ where: { id: c.get("userId") } });
  return c.json({ ok: true });
});

export default router;
