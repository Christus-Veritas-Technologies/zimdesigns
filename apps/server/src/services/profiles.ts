import db from "@zimdesigns/db";

function sanitizeUser(u: {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  role: string | null;
  createdAt: Date;
  linkedinUrl: string | null;
  githubUrl: string | null;
  dribbbleUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  _count: { redesigns: number };
}) {
  return {
    id: u.id,
    name: u.name,
    username: u.username,
    avatarUrl: u.avatarUrl,
    bio: u.bio,
    role: u.role,
    createdAt: u.createdAt,
    redesignCount: u._count.redesigns,
    linkedinUrl: u.linkedinUrl,
    githubUrl: u.githubUrl,
    dribbbleUrl: u.dribbbleUrl,
    twitterUrl: u.twitterUrl,
    websiteUrl: u.websiteUrl,
  };
}

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
      createdAt: true,
      linkedinUrl: true,
      githubUrl: true,
      dribbbleUrl: true,
      twitterUrl: true,
      websiteUrl: true,
      _count: { select: { redesigns: true } },
    },
  });
  return sanitizeUser(user);
}

export async function getUserRedesigns(username: string) {
  const user = await db.user.findUniqueOrThrow({ where: { username }, select: { id: true } });

  const redesigns = await db.redesign.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true } },
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
    createdAt: r.createdAt,
    author: r.author,
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
