import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — From Setup to Direct Bookings in One Week",
  description:
    "Four phases. One week. We learn your property, build your website and booking system, send you a staging link for review, then go live. Here is exactly what happens from the moment you contact us to the moment your first direct booking lands.",
  alternates: {
    canonical: "https://hosts.christusveritas.tech/how-it-works",
  },
  openGraph: {
    url: "https://hosts.christusveritas.tech/how-it-works",
    title: "How It Works | CVT Hosts",
    description:
      "Four phases. One week. We handle the entire build — website, booking calendar, PayFast integration, WhatsApp notifications, Google Business setup. You review and approve. Then it goes live.",
  },
};

export default function HowItWorksPage() {
  return <main />;
}
