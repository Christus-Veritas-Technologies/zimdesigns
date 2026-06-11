import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact CVT Hosts — Get Your Direct Booking System",
  description:
    "WhatsApp us directly or send an email. Tell us about your property — rooms, location, what you currently use for bookings — and we will tell you which package fits. No forms. No ticket queues. Just a straight conversation about your property.",
  alternates: {
    canonical: "https://hosts.christusveritas.tech/contact",
  },
  openGraph: {
    url: "https://hosts.christusveritas.tech/contact",
    title: "Contact CVT Hosts",
    description:
      "No forms. No ticket queues. WhatsApp us directly and we will get back to you within a few hours. One conversation is all it takes to get started.",
  },
};

export default function ContactPage() {
  return <main />;
}
