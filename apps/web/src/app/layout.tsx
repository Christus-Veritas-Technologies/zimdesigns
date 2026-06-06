import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
import MobileNav from "@/components/mobile-nav";
import VerifyBanner from "@/components/verify-banner";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#E8A900",
};

export const metadata: Metadata = {
  title: {
    default: "ZimDesigns — Redesigns of Zimbabwean apps",
    template: "%s | ZimDesigns",
  },
  description: "Discover and share redesigns of apps used in Zimbabwe. Built by the community, for the community.",
  keywords: ["Zimbabwe", "app redesign", "UI design", "UX", "design community"],
  openGraph: {
    type: "website",
    siteName: "ZimDesigns",
    title: "ZimDesigns — Redesigns of Zimbabwean apps",
    description: "Discover and share redesigns of apps used in Zimbabwe.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZimDesigns",
    description: "Discover and share redesigns of apps used in Zimbabwe.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://zimdesigns.com"),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ZimDesigns",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="grid grid-rows-[auto_auto_1fr] min-h-svh">
            <Header />
            <VerifyBanner />
            <div className="pb-16 xl:pb-0">
              {children}
            </div>
          </div>
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
