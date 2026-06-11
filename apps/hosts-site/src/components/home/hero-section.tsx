import Link from "next/link";

import CvtChevron from "@/components/cvt-chevron";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6 w-full flex flex-col md:flex-row md:items-center gap-8 md:gap-16 py-24">
        {/* Left column */}
        <div className="flex-1 flex flex-col">
          <p
            className="font-heading font-normal text-muted uppercase mb-6 tracking-[0.2em]"
            style={{ fontSize: "11px" }}
          >
            For South African Guest Houses
          </p>

          <h1
            className="font-display font-bold text-foreground leading-[1.06] mb-6"
            style={{ fontSize: "clamp(44px, 6vw, 80px)" }}
          >
            You&apos;re losing R6,000
            <br />
            every month.
            <br />
            Not to bad business.
            <br />
            To Booking.com.
          </h1>

          <p className="font-body text-[17px] text-muted max-w-[560px] mb-8 leading-relaxed">
            Every booking through their platform costs you 15 to 20 percent.
            That is your profit, handed to a platform that owns your guest
            relationship and charges you again every time that same person comes
            back. CVT Hosts gives you a direct booking system built around your
            property — so guests book with you, pay you, and come back to you.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/how-it-works"
              className="bg-accent text-inverse hover:bg-accent-muted font-heading font-bold text-sm px-6 py-3 rounded-md transition-colors tracking-wide"
            >
              See How It Works
            </Link>
            <Link
              href="/packages"
              className="border border-border text-foreground hover:bg-surface font-heading font-medium text-sm px-6 py-3 rounded-md transition-colors"
            >
              View Packages
            </Link>
          </div>

          <p className="font-body text-xs text-muted mt-4">
            No long-term contracts. Cancel any month.
          </p>
        </div>

        {/* Right decoration */}
        <div className="hidden md:flex items-center justify-center flex-shrink-0">
          <CvtChevron
            size={380}
            opacity={0.06}
            strokeWidth={2.5}
            className="text-foreground"
          />
        </div>
      </div>

      {/* Background subtle gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
