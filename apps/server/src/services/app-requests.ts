import db from "@zimdesigns/db";

function sanitize(r: {
  id: string; appName: string; description: string | null; voteCount: number; status: string; createdAt: Date;
  requester: { id: string; name: string; username: string; avatarUrl: string | null };
}, hasVoted = false) {
  return { id: r.id, appName: r.appName, description: r.description, voteCount: r.voteCount, status: r.status, createdAt: r.createdAt, requester: r.requester, hasVoted };
}

export async function listAppRequests(viewerId?: string) {
  const items = await db.appRequest.findMany({
    orderBy: { voteCount: "desc" },
    take: 50,
    include: {
      requester: { select: { id: true, name: true, username: true, avatarUrl: true } },
      ...(viewerId && { votes: { where: { userId: viewerId } } }),
    },
  });
  return items.map((r) =>
    sanitize(r, viewerId ? (r as typeof r & { votes: { id: string }[] }).votes.length > 0 : false),
  );
}

export async function createAppRequest(requesterId: string, appName: string, description?: string) {
  const existing = await db.appRequest.findFirst({
    where: { appName: { equals: appName, mode: "insensitive" } },
  });
  if (existing) throw new Error("DUPLICATE");

  const r = await db.appRequest.create({
    data: { appName: appName.trim(), description: description?.trim() ?? null, requesterId },
    include: { requester: { select: { id: true, name: true, username: true, avatarUrl: true } } },
  });
  return sanitize(r, false);
}

export async function toggleAppRequestVote(userId: string, appRequestId: string) {
  const existing = await db.appRequestVote.findUnique({
    where: { userId_appRequestId: { userId, appRequestId } },
  });

  if (existing) {
    await db.appRequestVote.delete({ where: { id: existing.id } });
    const r = await db.appRequest.update({ where: { id: appRequestId }, data: { voteCount: { decrement: 1 } } });
    return { voteCount: r.voteCount, hasVoted: false };
  }

  await db.appRequestVote.create({ data: { userId, appRequestId } });
  const r = await db.appRequest.update({ where: { id: appRequestId }, data: { voteCount: { increment: 1 } } });
  return { voteCount: r.voteCount, hasVoted: true };
}

export async function getTrending() {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [topRedesigns, topDesigners] = await Promise.all([
    db.redesign.findMany({
      where: { createdAt: { gte: oneWeekAgo } },
      orderBy: { upvoteCount: "desc" },
      take: 10,
      include: { author: { select: { id: true, name: true, username: true, avatarUrl: true } } },
    }),
    db.user.findMany({
      where: { redesigns: { some: { createdAt: { gte: oneWeekAgo } } } },
      orderBy: { redesigns: { _count: "desc" } },
      take: 10,
      select: {
        id: true, name: true, username: true, avatarUrl: true, role: true,
        _count: { select: { redesigns: true } },
      },
    }),
  ]);

  return {
    topRedesigns: topRedesigns.map((r) => ({
      id: r.id, title: r.title, appName: r.appName,
      afterUrl: r.afterUrl, upvoteCount: r.upvoteCount,
      author: r.author,
    })),
    topDesigners: topDesigners.map((u) => ({
      id: u.id, name: u.name, username: u.username,
      avatarUrl: u.avatarUrl, role: u.role,
      redesignCount: u._count.redesigns,
    })),
  };
}
