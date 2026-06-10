import db from "@zimdesigns/db";

export async function listAdminUsers(opts: { page?: number; limit?: number; search?: string } = {}) {
  const limit = Math.min(opts.limit ?? 50, 100);
  const skip = ((opts.page ?? 1) - 1) * limit;

  const where = opts.search
    ? {
        OR: [
          { name: { contains: opts.search, mode: "insensitive" as const } },
          { username: { contains: opts.search, mode: "insensitive" as const } },
          { email: { contains: opts.search, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        role: true,
        banned: true,
        emailVerified: true,
        onboardingComplete: true,
        createdAt: true,
        _count: { select: { redesigns: true, followers: true } },
      },
    }),
    db.user.count({ where }),
  ]);

  return { users, total, page: opts.page ?? 1, limit };
}

export async function banUser(userId: string) {
  // Delete all refresh tokens to immediately log them out
  await db.refreshToken.deleteMany({ where: { userId } });
  return db.user.update({
    where: { id: userId },
    data: { banned: true },
    select: { id: true, banned: true },
  });
}

export async function unbanUser(userId: string) {
  return db.user.update({
    where: { id: userId },
    data: { banned: false },
    select: { id: true, banned: true },
  });
}

export async function listAdminReports(opts: { status?: string } = {}) {
  return db.report.findMany({
    where: opts.status ? { status: opts.status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      reporter: { select: { id: true, name: true, username: true, avatarUrl: true } },
    },
  });
}

export async function resolveReport(id: string) {
  return db.report.update({ where: { id }, data: { status: "resolved" } });
}

export async function dismissReport(id: string) {
  return db.report.update({ where: { id }, data: { status: "dismissed" } });
}
