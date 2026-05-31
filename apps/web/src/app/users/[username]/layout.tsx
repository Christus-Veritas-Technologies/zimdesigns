import type { Metadata } from "next";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";

async function fetchProfile(username: string) {
  try {
    const res = await fetch(`${SERVER_URL}/api/users/${username}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json() as Promise<{
      name: string;
      username: string;
      bio: string | null;
      avatarUrl: string | null;
      redesignCount: number;
    }>;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchProfile(username);

  if (!profile) return { title: `@${username}` };

  const description = profile.bio ?? `${profile.redesignCount} redesign${profile.redesignCount !== 1 ? "s" : ""} on ZimDesigns`;
  const imageUrl = profile.avatarUrl?.startsWith("http") ? profile.avatarUrl : profile.avatarUrl ? `${SERVER_URL}${profile.avatarUrl}` : undefined;

  return {
    title: `${profile.name} (@${profile.username})`,
    description,
    openGraph: {
      title: `${profile.name} on ZimDesigns`,
      description,
      ...(imageUrl && { images: [{ url: imageUrl, width: 400, height: 400, alt: profile.name }] }),
    },
    twitter: {
      card: imageUrl ? "summary" : "summary",
      title: profile.name,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
