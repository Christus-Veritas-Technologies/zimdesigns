import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packages and Pricing — Three Plans for SA Guest Houses",
  description:
    "Starter (R7,000 once-off, R499/month), Growth (R15,000 once-off, R899/month), Full Stack with WhatsApp AI Agent (R30,000 once-off, R1,800/month). Every package includes a professional website, bookings database, and direct PayFast payments. Launch offer: 50% off setup fees for the first 5 properties.",
  alternates: {
    canonical: "https://hosts.christusveritas.tech/packages",
  },
  openGraph: {
    url: "https://hosts.christusveritas.tech/packages",
    title: "Packages and Pricing | CVT Hosts",
    description:
      "Three packages built for SA guest houses — from a professional direct booking website to a fully autonomous WhatsApp AI Agent that books, confirms, and collects payment around the clock.",
  },
};

export default function PackagesPage() {
  return <main />;
}
