import { HugeiconsIcon } from "@hugeicons/react";
import {
  Globe02Icon,
  Calendar03Icon,
  CreditCard,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";

import WebsiteIllustration from "@/components/illustrations/website-illustration";
import CalendarIllustration from "@/components/illustrations/calendar-illustration";
import PaymentIllustration from "@/components/illustrations/payment-illustration";
import WhatsappIllustration from "@/components/illustrations/whatsapp-illustration";

const FEATURES = [
  {
    icon: Globe02Icon,
    illustration: WebsiteIllustration,
    headline: "Your own website",
    body: "Professional, mobile-first, built for your property. Your rooms, your rates, your brand — not a listing on someone else's platform.",
  },
  {
    icon: Calendar03Icon,
    illustration: CalendarIllustration,
    headline: "Live booking calendar",
    body: "Guests select dates, confirm availability instantly, and pay upfront. Every booking lands in your database in real time.",
  },
  {
    icon: CreditCard,
    illustration: PaymentIllustration,
    headline: "Direct payments via PayFast",
    body: "South Africa's most trusted payment platform. Card and EFT. Money goes straight to your account at the point of booking — no platform holding it, no payout delays.",
  },
  {
    icon: WhatsappIcon,
    illustration: WhatsappIllustration,
    headline: "WhatsApp notifications",
    body: "Every booking triggers an instant WhatsApp notification to you — guest name, dates, room, and payment confirmation. No dashboard to check. It comes to you.",
  },
] as const;

export default function SolutionSection() {
  return (
    <section className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <p
          className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-4"
          style={{ fontSize: "11px" }}
        >
          What CVT Hosts Builds For You
        </p>
        <h2
          className="font-heading font-bold text-foreground leading-tight"
          style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
        >
          Your property. Your bookings.
          <br />
          Your revenue.
        </h2>
        <p className="font-body text-[17px] text-muted max-w-2xl mt-5 leading-relaxed">
          CVT Hosts builds your property a complete direct booking system — a
          professional website, a live availability calendar, upfront payment
          collection via PayFast, a full bookings database, and a shareable
          booking link you can put anywhere.
        </p>

        {/* Bento grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((feature, i) => {
            const Illustration = feature.illustration;
            return (
              <div
                key={i}
                className="relative bg-surface border border-border rounded-2xl p-7 overflow-hidden min-h-[220px] flex flex-col gap-4 group"
              >
                {/* Background glow */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
                  }}
                  aria-hidden="true"
                />

                <div
                  className="size-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
                >
                  <HugeiconsIcon
                    icon={feature.icon}
                    size={24}
                    strokeWidth={1.5}
                    primaryColor="var(--accent)"
                  />
                </div>

                <div className="flex flex-col gap-2 max-w-[320px]">
                  <h3 className="font-heading font-bold text-[18px] text-foreground leading-snug">
                    {feature.headline}
                  </h3>
                  <p className="font-body text-sm text-muted leading-relaxed">
                    {feature.body}
                  </p>
                </div>

                {/* Illustration — bottom right */}
                <div className="absolute bottom-4 right-4 opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none">
                  <Illustration size={72} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
