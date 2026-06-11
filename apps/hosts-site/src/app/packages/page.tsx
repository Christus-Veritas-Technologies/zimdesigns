import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  WhatsappIcon,
  Globe02Icon,
  Calendar03Icon,
  UserMultiple02Icon,
  ChartIncreaseIcon,
  Mail01Icon,
  MoneySend01Icon,
} from "@hugeicons/core-free-icons";
import { CreditCard } from "@hugeicons/core-free-icons";
import CvtChevron from "@/components/cvt-chevron";
import { env } from "@/env";

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

type Check = true | false | string;

interface PackageCol {
  name: string;
  tagline: string;
  setupFull: string;
  setupLaunch: string;
  monthly: string;
  monthlyNote: string;
  highlighted: boolean;
  badge?: string;
  cta: string;
}

interface FeatureRow {
  category: string;
  label: string;
  starter: Check;
  growth: Check;
  fullStack: Check;
  note?: string;
}

const PACKAGES: PackageCol[] = [
  {
    name: "Starter",
    tagline: "One property, up to 6 room types",
    setupFull: "R7,000",
    setupLaunch: "R3,500",
    monthly: "R499",
    monthlyNote: "/month",
    highlighted: false,
    cta: "Get Starter",
  },
  {
    name: "Growth",
    tagline: "Up to 20 room types, full analytics",
    setupFull: "R15,000",
    setupLaunch: "R7,500",
    monthly: "R899",
    monthlyNote: "/month",
    highlighted: true,
    badge: "Most Popular",
    cta: "Get Growth",
  },
  {
    name: "Full Stack",
    tagline: "Multi-property + WhatsApp AI Agent",
    setupFull: "R30,000",
    setupLaunch: "R15,000",
    monthly: "R1,800",
    monthlyNote: "/month",
    highlighted: false,
    cta: "Get Full Stack",
  },
];

const FEATURES: FeatureRow[] = [
  // Website & Design
  { category: "Website", label: "Professional property website", starter: true, growth: true, fullStack: true },
  { category: "Website", label: "Mobile-first responsive design", starter: true, growth: true, fullStack: true },
  { category: "Website", label: "Custom domain + SSL", starter: true, growth: true, fullStack: true },
  { category: "Website", label: "SEO metadata + sitemap", starter: true, growth: true, fullStack: true },
  { category: "Website", label: "Google Business listing setup", starter: true, growth: true, fullStack: true },
  { category: "Website", label: "Number of room types", starter: "Up to 6", growth: "Up to 20", fullStack: "Unlimited" },
  { category: "Website", label: "Multiple properties", starter: false, growth: false, fullStack: true },
  // Booking system
  { category: "Bookings", label: "Live booking calendar", starter: true, growth: true, fullStack: true },
  { category: "Bookings", label: "Real-time availability", starter: true, growth: true, fullStack: true },
  { category: "Bookings", label: "Custom booking rules and policies", starter: false, growth: true, fullStack: true },
  { category: "Bookings", label: "Minimum stay and blocked dates", starter: false, growth: true, fullStack: true },
  { category: "Bookings", label: "Seasonal rate management", starter: false, growth: true, fullStack: true },
  { category: "Bookings", label: "Channel manager sync (Airbnb, Booking.com)", starter: false, growth: false, fullStack: true },
  // Payments
  { category: "Payments", label: "PayFast payment gateway", starter: true, growth: true, fullStack: true },
  { category: "Payments", label: "Card and EFT payments", starter: true, growth: true, fullStack: true },
  { category: "Payments", label: "Upfront payment at booking", starter: true, growth: true, fullStack: true },
  { category: "Payments", label: "Deposit + balance split payment", starter: false, growth: true, fullStack: true },
  // Notifications
  { category: "Notifications", label: "WhatsApp booking alerts", starter: true, growth: true, fullStack: true },
  { category: "Notifications", label: "Guest email confirmations", starter: true, growth: true, fullStack: true },
  { category: "Notifications", label: "WhatsApp AI Agent (books autonomously)", starter: false, growth: false, fullStack: true },
  // Data
  { category: "Data", label: "Guest bookings database", starter: true, growth: true, fullStack: true },
  { category: "Data", label: "Guest contact details export", starter: false, growth: true, fullStack: true },
  { category: "Data", label: "Booking analytics dashboard", starter: false, growth: true, fullStack: true },
  { category: "Data", label: "Monthly performance report", starter: false, growth: false, fullStack: true },
  // Support
  { category: "Support", label: "Launch support", starter: true, growth: true, fullStack: true },
  { category: "Support", label: "Standard email/WhatsApp support", starter: true, growth: true, fullStack: true },
  { category: "Support", label: "Dedicated support line", starter: false, growth: false, fullStack: true },
];

const FAQS = [
  {
    q: "What happens after the once-off setup fee?",
    a: "You pay the monthly retainer and that is it. No commission, no percentage of bookings, no per-transaction fee. The monthly retainer covers hosting, database, ongoing updates, and support.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. There is no long-term contract. You can cancel with one month's notice. If you cancel, your site comes down and your data is exported to you in a format you can use.",
  },
  {
    q: "What is the WhatsApp AI Agent?",
    a: "It is an AI assistant connected to your WhatsApp number that handles guest enquiries, checks availability, confirms bookings, and collects payment — around the clock, without you needing to respond. It is included in the Full Stack package.",
  },
  {
    q: "Does the once-off fee include all changes during setup?",
    a: "Yes. During the build and review phases, we make as many changes as you need until you are satisfied. The setup fee covers the complete build, not just a first draft.",
  },
];

function CheckCell({ value }: { value: Check }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <span
          className="size-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
          aria-label="Included"
        >
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </span>
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <span
          className="font-body text-muted"
          style={{ fontSize: "18px", lineHeight: 1 }}
          aria-label="Not included"
        >
          —
        </span>
      </div>
    );
  }
  return (
    <p className="font-body text-xs text-accent text-center font-medium">
      {value}
    </p>
  );
}

export default function PackagesPage() {
  const whatsappUrl = `https://wa.me/${env.NEXT_PUBLIC_WHATSAPP_NUMBER}`;
  const categories = [...new Set(FEATURES.map((f) => f.category))];

  return (
    <main>
      {/* Hero */}
      <section className="pt-24 pb-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <p
            className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: "11px" }}
          >
            Pricing
          </p>
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16">
            <h1
              className="font-heading font-bold text-foreground leading-tight flex-1"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              One setup fee.
              <br />
              One monthly retainer.
              <br />
              Zero commission.
            </h1>
            <p className="font-body text-[17px] text-muted max-w-md leading-relaxed pb-1">
              Three packages for South African guest houses. From a single
              professional direct booking website to a fully autonomous booking
              system with a WhatsApp AI Agent.
            </p>
          </div>
        </div>
      </section>

      {/* Package cards */}
      <section className="py-4 pb-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {PACKAGES.map((pkg, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-7 flex flex-col gap-5"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: pkg.highlighted
                    ? "2px solid var(--accent)"
                    : "1px solid var(--border)",
                }}
              >
                {pkg.highlighted && (
                  <div
                    className="absolute top-0 inset-x-0 h-[3px] rounded-t-2xl"
                    style={{ backgroundColor: "var(--accent)" }}
                    aria-hidden="true"
                  />
                )}
                {pkg.badge && (
                  <span
                    className="absolute -top-3 left-7 font-heading font-bold text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "var(--text-inverse)",
                    }}
                  >
                    {pkg.badge}
                  </span>
                )}

                <div>
                  <h2 className="font-heading font-extrabold text-[20px] text-foreground">
                    {pkg.name}
                  </h2>
                  <p className="font-body text-sm text-muted mt-1 leading-relaxed">
                    {pkg.tagline}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-body text-sm text-muted line-through">
                      {pkg.setupFull}
                    </span>
                    <span className="font-heading font-bold text-foreground text-lg">
                      {pkg.setupLaunch}
                    </span>
                    <span className="font-body text-xs text-muted">
                      once-off
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-heading font-bold text-accent"
                      style={{ fontSize: "26px" }}
                    >
                      {pkg.monthly}
                    </span>
                    <span className="font-body text-sm text-muted">
                      {pkg.monthlyNote}
                    </span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="block text-center font-heading font-bold text-sm py-3 rounded-md transition-colors tracking-wide"
                  style={
                    pkg.highlighted
                      ? {
                          backgroundColor: "var(--accent)",
                          color: "var(--text-inverse)",
                        }
                      : {
                          border: "1px solid var(--border)",
                          color: "var(--text-primary)",
                        }
                  }
                >
                  {pkg.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Launch offer band */}
          <div
            className="mt-5 w-full rounded-xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ backgroundColor: "var(--bg-subtle)" }}
          >
            <div className="text-center md:text-left">
              <p
                className="font-heading font-bold tracking-widest uppercase text-muted"
                style={{ fontSize: "10px" }}
              >
                Launch Offer — First 5 Properties Only
              </p>
              <p className="font-body text-sm text-foreground mt-1">
                50% off every setup fee. Prices shown above are the launch
                prices. Monthly retainer unchanged.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 font-heading font-bold text-sm px-5 py-2.5 rounded-md transition-colors tracking-wide whitespace-nowrap"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--text-inverse)",
              }}
            >
              Claim Your Spot
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-4">
        <CvtChevron size={280} opacity={0.04} className="text-foreground" />
      </div>

      {/* Feature comparison table */}
      <section className="py-16 pb-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <p
            className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: "11px" }}
          >
            Full Comparison
          </p>
          <h2
            className="font-heading font-bold text-foreground leading-tight mb-10"
            style={{ fontSize: "clamp(24px, 3.5vw, 38px)" }}
          >
            What is in each package
          </h2>

          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl overflow-hidden border border-border">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-surface">
              <div className="px-6 py-4" />
              {PACKAGES.map((pkg, i) => (
                <div
                  key={i}
                  className="px-4 py-4 text-center border-l border-border"
                  style={
                    pkg.highlighted
                      ? { backgroundColor: "rgba(201,168,76,0.04)" }
                      : {}
                  }
                >
                  <p className="font-heading font-bold text-sm text-foreground">
                    {pkg.name}
                  </p>
                  <p className="font-body text-xs text-accent font-medium mt-0.5">
                    {pkg.monthly}/mo
                  </p>
                </div>
              ))}
            </div>

            {/* Feature rows grouped by category */}
            {categories.map((cat) => (
              <div key={cat}>
                {/* Category header */}
                <div
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] border-t border-border"
                  style={{ backgroundColor: "var(--bg-subtle)" }}
                >
                  <div className="px-6 py-2.5 col-span-4">
                    <p
                      className="font-heading font-bold text-muted uppercase tracking-widest"
                      style={{ fontSize: "10px" }}
                    >
                      {cat}
                    </p>
                  </div>
                </div>
                {FEATURES.filter((f) => f.category === cat).map((f, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr] border-t border-border hover:bg-surface/50 transition-colors"
                  >
                    <div className="px-6 py-3.5">
                      <p className="font-body text-sm text-muted">{f.label}</p>
                    </div>
                    <div
                      className="px-4 py-3.5 flex items-center justify-center border-l border-border"
                    >
                      <CheckCell value={f.starter} />
                    </div>
                    <div
                      className="px-4 py-3.5 flex items-center justify-center border-l border-border"
                      style={{ backgroundColor: "rgba(201,168,76,0.02)" }}
                    >
                      <CheckCell value={f.growth} />
                    </div>
                    <div className="px-4 py-3.5 flex items-center justify-center border-l border-border">
                      <CheckCell value={f.fullStack} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Mobile: stacked per-package cards */}
          <div className="md:hidden flex flex-col gap-6">
            {PACKAGES.map((pkg, pi) => (
              <div
                key={pi}
                className="rounded-2xl border overflow-hidden"
                style={{
                  borderColor: pkg.highlighted
                    ? "var(--accent)"
                    : "var(--border)",
                  borderWidth: pkg.highlighted ? "2px" : "1px",
                }}
              >
                <div
                  className="px-5 py-4 border-b border-border"
                  style={
                    pkg.highlighted
                      ? { backgroundColor: "rgba(201,168,76,0.04)" }
                      : { backgroundColor: "var(--bg-surface)" }
                  }
                >
                  <p className="font-heading font-bold text-lg text-foreground">
                    {pkg.name}
                  </p>
                  <p className="font-body text-xs text-muted mt-0.5">
                    {pkg.tagline}
                  </p>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3 bg-surface">
                  {FEATURES.map((f, fi) => {
                    const val =
                      pi === 0 ? f.starter : pi === 1 ? f.growth : f.fullStack;
                    return (
                      <div
                        key={fi}
                        className="flex items-center justify-between gap-4 py-1 border-b border-border last:border-0"
                      >
                        <p className="font-body text-sm text-muted flex-1">
                          {f.label}
                        </p>
                        <CheckCell value={val} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-4 pb-24">
        <div className="max-w-[800px] mx-auto px-6">
          <p
            className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-8"
            style={{ fontSize: "11px" }}
          >
            Common Questions
          </p>
          <div className="flex flex-col gap-0">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="py-7 border-t border-border flex flex-col gap-3"
              >
                <h3 className="font-heading font-bold text-[17px] text-foreground">
                  {faq.q}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
            <div className="border-t border-border" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4 md:px-6">
        <div
          className="max-w-[1100px] mx-auto rounded-3xl py-16 px-6 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ backgroundColor: "var(--bg-subtle)" }}
        >
          <div className="flex flex-col gap-3 max-w-lg">
            <h2
              className="font-display font-bold text-foreground leading-[1.1]"
              style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
            >
              Not sure which package fits your property?
            </h2>
            <p className="font-body text-[16px] text-muted leading-relaxed">
              Tell us about your setup on WhatsApp. We will tell you exactly
              which plan is right for you — no sales pitch, just an honest
              answer.
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 justify-center font-heading font-bold text-sm px-6 py-3 rounded-md transition-colors tracking-wide"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--text-inverse)",
              }}
            >
              <HugeiconsIcon
                icon={WhatsappIcon}
                size={16}
                strokeWidth={1.5}
                primaryColor="var(--text-inverse)"
              />
              Ask on WhatsApp
            </Link>
            <Link
              href="/compare"
              className="text-center font-body text-sm text-muted hover:text-foreground transition-colors underline underline-offset-2"
            >
              Compare CVT Hosts vs Booking.com
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
