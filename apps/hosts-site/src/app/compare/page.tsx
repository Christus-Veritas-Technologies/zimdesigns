import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CVT Hosts vs Booking.com — The Real Cost Comparison",
  description:
    "Booking.com charges 15–25% on every booking, forever. They own your guest data, your guest relationships, and your repeat bookings. CVT Hosts charges a fixed monthly fee and gives you everything you build — your website, your database, your guest list, your revenue.",
  alternates: {
    canonical: "https://hosts.christusveritas.tech/compare",
  },
  openGraph: {
    url: "https://hosts.christusveritas.tech/compare",
    title: "CVT Hosts vs Booking.com | CVT Hosts",
    description:
      "A factual comparison of what each gives your property and what each costs you over time. One takes a cut of everything. The other builds something you own.",
  },
};

export default function ComparePage() {
  return <main />;
}
