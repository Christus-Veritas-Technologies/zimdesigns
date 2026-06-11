import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CVT Hosts — Stop Paying Commission. Start Owning Your Bookings.",
  description:
    "A guest house doing R30,000/month in bookings pays up to R6,000 in commission every single month. CVT Hosts builds you a complete direct booking system — website, live calendar, PayFast payments, and WhatsApp notifications — starting at R499/month.",
  alternates: {
    canonical: "https://hosts.christusveritas.tech",
  },
  openGraph: {
    url: "https://hosts.christusveritas.tech",
    title: "CVT Hosts — Stop Paying Commission. Start Owning Your Bookings.",
    description:
      "Every booking through Booking.com costs you 15 to 20 percent. CVT Hosts gives you a direct booking system built around your property — so guests book with you, pay you, and come back to you.",
  },
};

export default function HomePage() {
  return <main />;
}
