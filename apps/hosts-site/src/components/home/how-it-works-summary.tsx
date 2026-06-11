import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon, TickDouble01Icon, Rocket01Icon } from "@hugeicons/core-free-icons";

const STEPS = [
  {
    number: "01",
    icon: Settings01Icon,
    headline: "We build your system",
    body: "You send us your property details, photos, and room information. We build your website, booking engine, and database — branded to your property.",
    timeline: "Day 1–4",
  },
  {
    number: "02",
    icon: TickDouble01Icon,
    headline: "You review and approve",
    body: "We send you a staging link. You check every page, every room, every rate. We adjust until it is exactly right. Nothing goes live without your sign-off.",
    timeline: "Day 4–6",
  },
  {
    number: "03",
    icon: Rocket01Icon,
    headline: "Guests book direct",
    body: "Your site goes live. Guests find you, book directly, and pay upfront. You get a WhatsApp notification. That is the whole process.",
    timeline: "Day 6–7",
  },
] as const;

export default function HowItWorksSummary() {
  return (
    <section className="py-24">
      <div
        className="max-w-[1100px] mx-auto px-4 md:px-6 rounded-3xl py-16"
        style={{ backgroundColor: "var(--bg-subtle)" }}
      >
        {/* Header */}
        <div className="px-6 mb-12">
          <p
            className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: "11px" }}
          >
            The Process
          </p>
          <h2
            className="font-heading font-bold text-foreground leading-tight"
            style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
          >
            Live in one week.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {STEPS.map((step, i) => (
            <div key={i} className="px-8 py-6 md:py-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="font-heading font-black text-accent leading-none"
                  style={{ fontSize: "clamp(48px, 6vw, 72px)", opacity: 0.4 }}
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <span
                  className="font-heading font-medium text-xs text-muted tracking-widest uppercase"
                  style={{ fontSize: "10px" }}
                >
                  {step.timeline}
                </span>
              </div>
              <div
                className="size-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
              >
                <HugeiconsIcon
                  icon={step.icon}
                  size={20}
                  strokeWidth={1.5}
                  primaryColor="var(--accent)"
                />
              </div>
              <h3 className="font-heading font-bold text-[17px] text-foreground leading-snug">
                {step.headline}
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mt-12 px-8">
          <Link
            href="/packages"
            className="bg-accent text-inverse hover:bg-accent-muted font-heading font-bold text-sm px-6 py-3 rounded-md transition-colors tracking-wide"
          >
            See Our Packages
          </Link>
          <Link
            href="/contact"
            className="border border-border text-foreground hover:bg-surface font-heading font-medium text-sm px-6 py-3 rounded-md transition-colors"
          >
            Talk to Us First
          </Link>
        </div>
      </div>
    </section>
  );
}
