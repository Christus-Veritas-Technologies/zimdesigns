import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { WhatsappIcon } from "@hugeicons/core-free-icons";
import { env } from "@/env";

export default function CtaSection() {
  const whatsappUrl = `https://wa.me/${env.NEXT_PUBLIC_WHATSAPP_NUMBER}`;

  return (
    <section className="py-24 px-4 md:px-6">
      <div
        className="max-w-[1100px] mx-auto rounded-3xl py-20 px-6 text-center"
        style={{ backgroundColor: "var(--bg-subtle)" }}
      >
        <p
          className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-6"
          style={{ fontSize: "11px" }}
        >
          Get Started
        </p>

        <h2
          className="font-display font-bold text-foreground leading-[1.1] max-w-3xl mx-auto"
          style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
        >
          Stop paying commission on guests
          <br />
          you already earned.
        </h2>

        <p className="font-body text-[17px] text-muted max-w-xl mx-auto mt-5 leading-relaxed">
          Your property is already doing the work. CVT Hosts makes sure the
          revenue from that work stays with you. Setup takes one week. You can
          cancel any time.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-10">
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-heading font-bold text-sm px-6 py-3 rounded-md transition-colors tracking-wide"
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
            WhatsApp Us Now
          </Link>
          <Link
            href="/demo"
            className="border border-border text-foreground hover:bg-surface font-heading font-medium text-sm px-6 py-3 rounded-md transition-colors"
          >
            See the Demo
          </Link>
        </div>

        <p className="font-body text-xs text-muted mt-5">
          No long-term contract. R0 to cancel. Live within 7 days.
        </p>
      </div>
    </section>
  );
}
