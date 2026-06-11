import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserMultiple02Icon,
  Settings01Icon,
  TickDouble01Icon,
  Rocket01Icon,
  Globe02Icon,
  Calendar03Icon,
  WhatsappIcon,
  Mail01Icon,
  ChartIncreaseIcon,
  MoneySend01Icon,
} from "@hugeicons/core-free-icons";
import { CreditCard } from "@hugeicons/core-free-icons";
import CvtChevron from "@/components/cvt-chevron";

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

const PHASES = [
  {
    number: "01",
    icon: UserMultiple02Icon,
    label: "Discovery",
    timeline: "Day 1",
    headline: "We learn your property",
    body: "You send us your property details — rooms, rates, photos, your current setup, and what you want the site to do. We do not ask you to fill in a form. We have a real conversation on WhatsApp or by email, ask the questions that matter, and clarify anything that is unclear before we build a single page.",
    bullets: [
      "Property walkthrough via WhatsApp photos or a brief call",
      "Room types, capacities, and rate structure",
      "Your cancellation and deposit policy",
      "Any special rules — minimum stays, seasonal rates, excluded dates",
      "Design preferences and existing brand colours if any",
    ],
  },
  {
    number: "02",
    icon: Settings01Icon,
    label: "Build",
    timeline: "Day 1–4",
    headline: "We build the entire system",
    body: "Once we have what we need, we build. A professional website structured for your property, a live booking calendar with your rooms and rates loaded, PayFast payment integration connected to your account, WhatsApp booking alerts, and a bookings database that records every reservation. You do not do any of this. We do it entirely.",
    bullets: [
      "Mobile-first property website, branded to your colours",
      "Booking calendar with real-time availability",
      "PayFast payment gateway connected to your account",
      "WhatsApp notifications for every new booking",
      "Guest database with contact details",
      "SEO metadata, sitemap, and Google Business listing setup",
    ],
  },
  {
    number: "03",
    icon: TickDouble01Icon,
    label: "Review",
    timeline: "Day 4–6",
    headline: "You check every detail",
    body: "We send you a staging link — a private URL where your full site and booking system are live but not yet public. You go through every page, every room listing, every rate, every policy. You test the booking flow end to end. If anything is wrong, unclear, or not quite right, you tell us and we fix it. Nothing goes to your guests until you sign off on it.",
    bullets: [
      "Full staging preview at a private URL",
      "Test booking flow with a real payment (refunded immediately)",
      "Review every room listing and rate",
      "Request changes — as many rounds as needed",
      "Final approval before launch",
    ],
  },
  {
    number: "04",
    icon: Rocket01Icon,
    label: "Launch",
    timeline: "Day 6–7",
    headline: "Your site goes live",
    body: "Once you approve, we connect your custom domain, set the site public, submit it to Google, and send you the shareable booking link. From that moment, any guest who lands on your site can check availability, select a room, pay upfront, and have a confirmation in their inbox — with a WhatsApp notification landing on your phone.",
    bullets: [
      "Custom domain connected and SSL configured",
      "Site indexed and submitted to Google Search Console",
      "Shareable booking link for WhatsApp and social media",
      "Your first test booking confirmed",
      "Handover document with everything you need to know",
    ],
  },
] as const;

const DELIVERABLES = [
  { icon: Globe02Icon, label: "Professional property website" },
  { icon: Calendar03Icon, label: "Live booking calendar" },
  { icon: CreditCard, label: "PayFast payment integration" },
  { icon: WhatsappIcon, label: "WhatsApp booking alerts" },
  { icon: Mail01Icon, label: "Guest email confirmations" },
  { icon: ChartIncreaseIcon, label: "Bookings analytics dashboard" },
  { icon: MoneySend01Icon, label: "Guest payment database" },
  { icon: UserMultiple02Icon, label: "Guest contact database" },
] as const;

export default function HowItWorksPage() {
  return (
    <main>
      {/* Hero */}
      <section className="pt-24 pb-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <p
            className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: "11px" }}
          >
            The Process
          </p>
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16">
            <h1
              className="font-heading font-bold text-foreground leading-tight flex-1"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              Built and live
              <br />
              in one week.
            </h1>
            <p className="font-body text-[17px] text-muted max-w-md leading-relaxed pb-1">
              Four phases from first contact to first direct booking. We handle
              the entire build. You review and approve. Everything else is us.
            </p>
          </div>
        </div>
      </section>

      {/* Phase timeline */}
      <section className="py-8 pb-24">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col gap-0">
          {PHASES.map((phase, i) => (
            <div
              key={i}
              className="relative grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12 py-12 border-t border-border"
            >
              {/* Left: number + icon */}
              <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3 md:pt-1">
                <span
                  className="font-heading font-black text-accent leading-none"
                  style={{ fontSize: "clamp(44px, 5vw, 64px)", opacity: 0.35 }}
                  aria-hidden="true"
                >
                  {phase.number}
                </span>
                <div className="flex items-center gap-2 md:flex-col md:items-start md:gap-1">
                  <div
                    className="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
                  >
                    <HugeiconsIcon
                      icon={phase.icon}
                      size={20}
                      strokeWidth={1.5}
                      primaryColor="var(--accent)"
                    />
                  </div>
                  <div>
                    <p
                      className="font-heading font-bold text-accent uppercase tracking-widest"
                      style={{ fontSize: "9px" }}
                    >
                      {phase.label}
                    </p>
                    <p
                      className="font-body text-muted"
                      style={{ fontSize: "11px" }}
                    >
                      {phase.timeline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: content */}
              <div className="flex flex-col gap-5">
                <h2 className="font-heading font-bold text-foreground" style={{ fontSize: "clamp(22px, 3vw, 30px)" }}>
                  {phase.headline}
                </h2>
                <p className="font-body text-[16px] text-muted leading-relaxed max-w-2xl">
                  {phase.body}
                </p>
                <ul className="flex flex-col gap-2.5 mt-1">
                  {phase.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 mt-[5px] size-1.5 rounded-full"
                        style={{ backgroundColor: "var(--accent)" }}
                        aria-hidden="true"
                      />
                      <span className="font-body text-sm text-muted leading-relaxed">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {/* End marker */}
          <div className="border-t border-border pt-8 flex items-center gap-4">
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
              aria-hidden="true"
            />
            <p className="font-heading font-bold text-sm text-foreground">
              Your first direct booking lands.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-4">
        <CvtChevron size={280} opacity={0.04} className="text-foreground" />
      </div>

      {/* What is included */}
      <section className="py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <p
            className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: "11px" }}
          >
            Every Build Includes
          </p>
          <h2
            className="font-heading font-bold text-foreground leading-tight"
            style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
          >
            Everything your property needs
            <br />
            to take direct bookings.
          </h2>
          <p className="font-body text-[17px] text-muted max-w-2xl mt-5 leading-relaxed">
            No separate charges for individual features. Every package includes
            the full booking system — the only difference between packages is
            capacity, advanced features, and the level of ongoing support.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {DELIVERABLES.map((item, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3"
              >
                <div
                  className="size-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={20}
                    strokeWidth={1.5}
                    primaryColor="var(--accent)"
                  />
                </div>
                <p className="font-heading font-bold text-sm text-foreground leading-snug">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 pb-24 px-4 md:px-6">
        <div
          className="max-w-[1100px] mx-auto rounded-3xl py-16 px-6 text-center"
          style={{ backgroundColor: "var(--bg-subtle)" }}
        >
          <h2
            className="font-display font-bold text-foreground leading-[1.1] max-w-2xl mx-auto"
            style={{ fontSize: "clamp(24px, 3.5vw, 44px)" }}
          >
            Ready to stop paying commission?
          </h2>
          <p className="font-body text-[16px] text-muted max-w-md mx-auto mt-4 leading-relaxed">
            Tell us about your property. We will tell you which package fits and
            get you live within a week.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              href="/contact"
              className="font-heading font-bold text-sm px-6 py-3 rounded-md transition-colors tracking-wide"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--text-inverse)",
              }}
            >
              Get Started
            </Link>
            <Link
              href="/packages"
              className="border border-border text-foreground hover:bg-surface font-heading font-medium text-sm px-6 py-3 rounded-md transition-colors"
            >
              See Packages and Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
