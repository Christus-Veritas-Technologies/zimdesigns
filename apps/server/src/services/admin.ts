import db from "@zimdesigns/db";

export async function getAdminStats() {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const [pendingRequests, liveApps, redesignsThisWeek, redesignsLastWeek, newDesigners, newDesignersLastWeek] =
    await Promise.all([
      db.appRequest.count({ where: { status: "open" } }),
      db.appEntry.count({ where: { isPublished: true } }),
      db.redesign.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      db.redesign.count({ where: { createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo } } }),
      db.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      db.user.count({ where: { createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo } } }),
    ]);

  const redesignsGrowth =
    redesignsLastWeek > 0
      ? Math.round(((redesignsThisWeek - redesignsLastWeek) / redesignsLastWeek) * 100)
      : 0;
  const designersGrowth =
    newDesignersLastWeek > 0
      ? Math.round(((newDesigners - newDesignersLastWeek) / newDesignersLastWeek) * 100)
      : 0;

  return {
    pendingRequests,
    liveApps,
    redesignsThisWeek,
    redesignsGrowth,
    newDesigners,
    designersGrowth,
  };
}

export async function getPendingAppRequests() {
  return db.appRequest.findMany({
    where: { status: "open" },
    orderBy: { voteCount: "desc" },
    include: {
      requester: { select: { id: true, name: true, username: true, avatarUrl: true } },
    },
  });
}

export async function approveAppRequest(id: string) {
  return db.appRequest.update({ where: { id }, data: { status: "approved" } });
}

export async function denyAppRequest(id: string) {
  return db.appRequest.update({ where: { id }, data: { status: "denied" } });
}

export async function requireAdminRole(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== "ADMIN") throw new Error("FORBIDDEN");
}

export async function listAdminApps() {
  return db.appEntry.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createAdminApp(data: {
  name: string;
  slug: string;
  description?: string;
  iconColor?: string;
  tags?: string[];
}) {
  return db.appEntry.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      iconColor: data.iconColor ?? "#E8A900",
      iconLetter: data.name.charAt(0).toUpperCase(),
      tags: JSON.stringify(data.tags ?? []),
      isPublished: true,
    },
  });
}
