import type { Metadata, Viewport } from "next";
import { Barlow, Inter, Playfair_Display } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://hosts.christusveritas.tech";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f0e0c" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "CVT Hosts — Direct Booking System for South African Guest Houses",
    template: "%s | CVT Hosts",
  },

  description:
    "Stop paying 15–20% commission to Booking.com. CVT Hosts builds your guest house a complete direct booking system — professional website, live calendar, PayFast payments, and WhatsApp notifications — so guests book with you, pay you, and come back to you.",

  keywords: [
    "direct booking system",
    "guest house website South Africa",
    "Booking.com alternative South Africa",
    "short term rental booking system",
    "PayFast booking integration",
    "guest house management system",
    "WhatsApp booking notifications",
    "direct bookings South Africa",
    "reduce OTA commission",
    "CVT Hosts",
    "Christus Veritas Technologies",
  ],

  authors: [{ name: "Christus Veritas Technologies", url: BASE_URL }],

  creator: "Christus Veritas Technologies",
  publisher: "Christus Veritas Technologies",

  category: "Technology",

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "CVT Hosts",
    title: "CVT Hosts — Direct Booking System for South African Guest Houses",
    description:
      "Stop paying commission on guests you already earned. CVT Hosts gives your property a complete direct booking system — website, calendar, payments, and WhatsApp notifications.",
    locale: "en_ZA",
  },

  twitter: {
    card: "summary_large_image",
    site: "@CVTHosts",
    creator: "@CVTHosts",
    title: "CVT Hosts — Direct Booking System for South African Guest Houses",
    description:
      "Stop paying commission on guests you already earned. CVT Hosts gives your property a complete direct booking system.",
  },

  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-ZA": BASE_URL,
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    // Add Google Search Console verification token when available
    // google: "VERIFICATION_TOKEN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-ZA"
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${barlow.variable} ${inter.variable}`}
    >
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <Providers>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
