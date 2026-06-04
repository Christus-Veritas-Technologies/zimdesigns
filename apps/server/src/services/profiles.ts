import db from "@zimdesigns/db";

export async function getProfile(username: string) {
  const user = await db.user.findUniqueOrThrow({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
      bio: true,
      role: true,
      location: true,
      createdAt: true,
      linkedinUrl: true,
      githubUrl: true,
      dribbbleUrl: true,
      twitterUrl: true,
      websiteUrl: true,
      figmaUrl: true,
      _count: { select: { redesigns: true, followers: true, following: true } },
      redesigns: { select: { upvoteCount: true } },
    },
  });
  const votesEarned = user.redesigns.reduce((sum, r) => sum + r.upvoteCount, 0);
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    role: user.role,
    location: user.location,
    createdAt: user.createdAt,
    redesignCount: user._count.redesigns,
    followerCount: user._count.followers,
    followingCount: user._count.following,
    votesEarned,
    linkedinUrl: user.linkedinUrl,
    githubUrl: user.githubUrl,
    dribbbleUrl: user.dribbbleUrl,
    twitterUrl: user.twitterUrl,
    websiteUrl: user.websiteUrl,
    figmaUrl: user.figmaUrl,
  };
}

export async function getUserRedesigns(username: string) {
  const user = await db.user.findUniqueOrThrow({ where: { username }, select: { id: true } });

  const redesigns = await db.redesign.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true, role: true } },
      _count: { select: { comments: true } },
    },
  });

  return redesigns.map((r) => ({
    id: r.id,
    title: r.title,
    appName: r.appName,
    description: r.description,
    beforeUrl: r.beforeUrl,
    afterUrl: r.afterUrl,
    tags: (() => { try { return JSON.parse(r.tags); } catch { return []; } })(),
    upvoteCount: r.upvoteCount,
    commentCount: (r as typeof r & { _count: { comments: number } })._count.comments,
    createdAt: r.createdAt,
    author: { ...r.author, role: r.author.role ?? null },
    hasUpvoted: false,
  }));
}

export async function searchRedesigns(q: string) {
  if (!q.trim()) return [];

  const term = q.trim().toLowerCase();

  const results = await db.redesign.findMany({
    where: {
      OR: [
        { title: { contains: term, mode: "insensitive" } },
        { appName: { contains: term, mode: "insensitive" } },
        { tags: { contains: term } },
      ],
    },
    orderBy: { upvoteCount: "desc" },
    take: 30,
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true } },
    },
  });

  return results.map((r) => ({
    id: r.id,
    title: r.title,
    appName: r.appName,
    description: r.description,
    beforeUrl: r.beforeUrl,
    afterUrl: r.afterUrl,
    tags: (() => { try { return JSON.parse(r.tags); } catch { return []; } })(),
    upvoteCount: r.upvoteCount,
    createdAt: r.createdAt,
    author: r.author,
    hasUpvoted: false,
  }));
}
