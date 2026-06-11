import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Demo — See Your Guest Booking System in Action",
  description:
    "A fully working demo built for a fictional SA guest house — Thornfield Guest House, Bloemfontein. Walk through the live booking calendar, the PayFast payment flow, and the WhatsApp booking experience exactly as your guests would.",
  alternates: {
    canonical: "https://hosts.christusveritas.tech/demo",
  },
  openGraph: {
    url: "https://hosts.christusveritas.tech/demo",
    title: "Live Demo | CVT Hosts",
    description:
      "See exactly what your guests will experience. A fully working demo with a live booking calendar, PayFast payment flow in test mode, and WhatsApp booking — built for a fictional SA guest house.",
  },
};

export default function DemoPage() {
  return <main />;
}
