import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  ChartIncreaseIcon,
  MoneySend01Icon,
  UserMultiple02Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import CvtChevron from "@/components/cvt-chevron";
import { env } from "@/env";

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

const COMPARISON_ROWS = [
  {
    label: "Cost model",
    cvt: "Fixed setup + flat monthly retainer",
    booking: "15–25% commission on every booking, forever",
    winner: "cvt" as const,
  },
  {
    label: "Monthly cost on R30,000 in bookings",
    cvt: "R499–R1,800/month (fixed)",
    booking: "R4,500–R7,500/month (varies)",
    winner: "cvt" as const,
  },
  {
    label: "Guest contact data",
    cvt: "Yours. In your database. Exportable anytime.",
    booking: "Belongs to the platform. You get limited access.",
    winner: "cvt" as const,
  },
  {
    label: "Repeat guest bookings",
    cvt: "Guest returns to your website. No commission.",
    booking: "Guest returns to Booking.com. You pay again.",
    winner: "cvt" as const,
  },
  {
    label: "Your brand",
    cvt: "Your own domain, your own design, your identity.",
    booking: "Your listing on their domain. You are a row in a list.",
    winner: "cvt" as const,
  },
  {
    label: "Payment timing",
    cvt: "Upfront at booking. Instant to your PayFast account.",
    booking: "After check-out. On the platform's schedule.",
    winner: "cvt" as const,
  },
  {
    label: "Cancellation policy",
    cvt: "Your policy. You set the rules.",
    booking: "Platform policy overrides yours in disputes.",
    winner: "cvt" as const,
  },
  {
    label: "Your monthly cost with zero bookings",
    cvt: "R499–R1,800 (retainer stays the same)",
    booking: "R0 — but also no direct booking infrastructure",
    winner: "neutral" as const,
    note: "Booking.com has no fixed cost, but also gives you no owned asset.",
  },
  {
    label: "Contract",
    cvt: "None. Cancel with one month's notice.",
    booking: "No contract, but deep integration lock-in.",
    winner: "cvt" as const,
  },
  {
    label: "Visibility to new guests",
    cvt: "Google, word-of-mouth, social — grows over time.",
    booking: "Large existing user base, but you pay for every view that converts.",
    winner: "neutral" as const,
    note: "Booking.com has reach. The question is whether the cost of that reach is worth it long term.",
  },
] as const;

const ANNUAL_SCENARIOS = [
  {
    monthly: "R20,000",
    bookingCommission: "R3,000–R5,000",
    bookingAnnual: "R36,000–R60,000",
    cvtMonthly: "R499",
    cvtAnnual: "R5,988 + once-off",
    saving: "R30,000–R54,000",
  },
  {
    monthly: "R30,000",
    bookingCommission: "R4,500–R7,500",
    bookingAnnual: "R54,000–R90,000",
    cvtMonthly: "R899",
    cvtAnnual: "R10,788 + once-off",
    saving: "R43,000–R79,000",
  },
  {
    monthly: "R50,000",
    bookingCommission: "R7,500–R12,500",
    bookingAnnual: "R90,000–R150,000",
    cvtMonthly: "R1,800",
    cvtAnnual: "R21,600 + once-off",
    saving: "R68,000–R128,000",
  },
] as const;

export default function ComparePage() {
  const whatsappUrl = `https://wa.me/${env.NEXT_PUBLIC_WHATSAPP_NUMBER}`;

  return (
    <main>
      {/* Hero */}
      <section className="pt-24 pb-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <p
            className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: "11px" }}
          >
            The Real Cost
          </p>
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16">
            <h1
              className="font-heading font-bold text-foreground leading-tight flex-1"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              CVT Hosts
              <br />
              <span style={{ color: "var(--text-secondary)" }}>vs</span>
              <br />
              Booking.com
            </h1>
            <p className="font-body text-[17px] text-muted max-w-md leading-relaxed pb-1">
              A factual comparison. One charges you a percentage of your revenue
              every time a guest sleeps in your property, forever. The other
              charges a flat monthly fee and gives you everything you build.
            </p>
          </div>
        </div>
      </section>

      {/* Danger callout */}
      <section className="pb-8">
        <div className="max-w-[1100px] mx-auto px-6">
          <div
            className="rounded-r-xl p-5 flex gap-4 items-start"
            style={{
              borderLeft: "3px solid var(--danger)",
              backgroundColor: "rgba(224,92,58,0.06)",
            }}
          >
            <HugeiconsIcon
              icon={AlertCircleIcon}
              size={20}
              strokeWidth={1.5}
              primaryColor="var(--danger)"
              className="flex-shrink-0 mt-0.5"
            />
            <p className="font-body text-[15px] text-foreground leading-relaxed">
              Booking.com&apos;s commission rate for South African properties
              is{" "}
              <strong className="text-foreground">15% to 25%</strong> per
              booking depending on your visibility programme participation. On
              R30,000/month in bookings, that is{" "}
              <strong className="text-foreground">
                R4,500 to R7,500 every month
              </strong>{" "}
              — paid to a platform that owns your guest data and charges you
              again when that same guest comes back.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="rounded-2xl overflow-hidden border border-border">
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_1.5fr_1.5fr] bg-surface">
              <div className="px-6 py-4">
                <p
                  className="font-heading font-bold text-muted uppercase tracking-widest"
                  style={{ fontSize: "10px" }}
                >
                  What you get
                </p>
              </div>
              <div className="px-5 py-4 border-l border-border text-center">
                <p className="font-heading font-bold text-sm text-accent">
                  CVT Hosts
                </p>
              </div>
              <div className="px-5 py-4 border-l border-border text-center">
                <p className="font-heading font-bold text-sm text-muted">
                  Booking.com
                </p>
              </div>
            </div>

            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_1.5fr_1.5fr] border-t border-border"
              >
                <div className="px-6 py-4 flex flex-col gap-1">
                  <p className="font-heading font-bold text-sm text-foreground">
                    {row.label}
                  </p>
                  {row.note && (
                    <p className="font-body text-xs text-muted leading-relaxed">
                      {row.note}
                    </p>
                  )}
                </div>
                <div
                  className="px-5 py-4 border-l border-border flex items-start"
                  style={
                    row.winner === "cvt"
                      ? { backgroundColor: "rgba(201,168,76,0.04)" }
                      : {}
                  }
                >
                  <p
                    className="font-body text-sm leading-relaxed"
                    style={{
                      color:
                        row.winner === "cvt"
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {row.cvt}
                  </p>
                </div>
                <div className="px-5 py-4 border-l border-border flex items-start">
                  <p className="font-body text-sm text-muted leading-relaxed">
                    {row.booking}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-4">
        <CvtChevron size={280} opacity={0.04} className="text-foreground" />
      </div>

      {/* Annual cost scenarios */}
      <section className="py-16 pb-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <p
            className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: "11px" }}
          >
            Annual Cost Scenarios
          </p>
          <h2
            className="font-heading font-bold text-foreground leading-tight mb-3"
            style={{ fontSize: "clamp(24px, 3.5vw, 38px)" }}
          >
            What you save in year one.
          </h2>
          <p className="font-body text-[17px] text-muted max-w-2xl leading-relaxed mb-10">
            These figures assume 50% of bookings are moved to direct. The other
            50% can remain on Booking.com while you build your direct channel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ANNUAL_SCENARIOS.map((s, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5"
              >
                <div>
                  <p
                    className="font-heading font-bold text-muted uppercase tracking-widest"
                    style={{ fontSize: "10px" }}
                  >
                    Monthly revenue
                  </p>
                  <p
                    className="font-heading font-black text-foreground mt-1"
                    style={{ fontSize: "clamp(28px, 3.5vw, 38px)" }}
                  >
                    {s.monthly}
                  </p>
                </div>

                <div
                  className="rounded-xl p-4 flex flex-col gap-2"
                  style={{ backgroundColor: "rgba(224,92,58,0.06)" }}
                >
                  <p
                    className="font-heading font-bold text-muted uppercase tracking-widest"
                    style={{ fontSize: "9px" }}
                  >
                    Booking.com (50% of bookings)
                  </p>
                  <p className="font-body text-sm text-foreground">
                    <span className="font-bold">{s.bookingCommission}/mo</span>{" "}
                    in commission
                  </p>
                  <p
                    className="font-body text-sm font-bold"
                    style={{ color: "var(--danger)" }}
                  >
                    {s.bookingAnnual} per year
                  </p>
                </div>

                <div
                  className="rounded-xl p-4 flex flex-col gap-2"
                  style={{ backgroundColor: "rgba(201,168,76,0.06)" }}
                >
                  <p
                    className="font-heading font-bold text-muted uppercase tracking-widest"
                    style={{ fontSize: "9px" }}
                  >
                    CVT Hosts (all direct)
                  </p>
                  <p className="font-body text-sm text-foreground">
                    <span className="font-bold">{s.cvtMonthly}/mo</span>{" "}
                    retainer
                  </p>
                  <p
                    className="font-body text-sm font-bold text-accent"
                  >
                    {s.cvtAnnual} per year
                  </p>
                </div>

                <div className="pt-2 border-t border-border">
                  <p
                    className="font-heading font-bold text-muted uppercase tracking-widest"
                    style={{ fontSize: "9px" }}
                  >
                    Potential annual saving
                  </p>
                  <p
                    className="font-heading font-black text-foreground mt-1"
                    style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
                  >
                    {s.saving}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="font-body text-xs text-muted mt-5 leading-relaxed max-w-2xl">
            Estimates assume 15% Booking.com commission rate and 50% of bookings
            successfully moved to direct within 12 months. Actual savings depend
            on your property's commission tier and how quickly you build your
            direct booking volume.
          </p>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-4 pb-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <p
            className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: "11px" }}
          >
            What You Actually Gain
          </p>
          <h2
            className="font-heading font-bold text-foreground leading-tight mb-10"
            style={{ fontSize: "clamp(24px, 3.5vw, 38px)" }}
          >
            It is not just about the money.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: UserMultiple02Icon,
                headline: "You own the guest relationship",
                body: "When a guest books directly, their name, contact details, and preferences belong to you. You can contact them before check-in, follow up after checkout, and reach out with a direct booking offer when they are planning their next trip.",
              },
              {
                icon: ChartIncreaseIcon,
                headline: "Your property builds equity",
                body: "A well-built direct booking website with its own domain and review profile becomes an asset. It grows in search ranking, accumulates direct traffic, and increases in value the longer it is live. Your Booking.com listing never belongs to you.",
              },
              {
                icon: MoneySend01Icon,
                headline: "Predictable revenue, faster access",
                body: "Direct bookings pay upfront, instantly to your PayFast account. No waiting for the platform's payout cycle, no hold-backs for disputed reservations, no deductions you did not account for.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4"
              >
                <div
                  className="size-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
                >
                  <HugeiconsIcon
                    icon={card.icon}
                    size={22}
                    strokeWidth={1.5}
                    primaryColor="var(--accent)"
                  />
                </div>
                <h3 className="font-heading font-bold text-[17px] text-foreground leading-snug">
                  {card.headline}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
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
              Ready to stop the commission bleed?
            </h2>
            <p className="font-body text-[16px] text-muted leading-relaxed">
              You do not need to leave Booking.com overnight. Start by moving
              your direct guests across. The commission you save in the first
              month covers most of the setup fee.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 flex-shrink-0 min-w-[180px]">
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
              Get Started
            </Link>
            <Link
              href="/packages"
              className="text-center border border-border text-foreground hover:bg-surface font-heading font-medium text-sm px-6 py-3 rounded-md transition-colors"
            >
              View Packages
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
