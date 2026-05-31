import type { Metadata } from "next";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";

async function fetchRedesign(id: string) {
  try {
    const res = await fetch(`${SERVER_URL}/api/redesigns/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json() as Promise<{
      title: string;
      appName: string;
      description: string | null;
      afterUrl: string;
      author: { username: string };
      tags: string[];
    }>;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const redesign = await fetchRedesign(id);

  if (!redesign) {
    return { title: "Redesign not found" };
  }

  const imageUrl = redesign.afterUrl.startsWith("http")
    ? redesign.afterUrl
    : `${SERVER_URL}${redesign.afterUrl}`;

  const description = redesign.description
    ?? `A redesign of ${redesign.appName} by @${redesign.author.username}`;

  return {
    title: redesign.title,
    description,
    keywords: [redesign.appName, ...redesign.tags, "Zimbabwe", "redesign", "UI design"],
    openGraph: {
      title: `${redesign.title} | ZimDesigns`,
      description,
      images: [{ url: imageUrl, width: 1200, height: 900, alt: redesign.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: redesign.title,
      description,
      images: [imageUrl],
    },
  };
}

export default function RedesignLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
