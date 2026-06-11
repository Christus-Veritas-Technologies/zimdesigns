import Link from "next/link";

const PACKAGES = [
  {
    name: "Starter",
    tagline: "For hosts just starting out with direct bookings",
    setupOriginal: "R4,999",
    setupLaunch: "R2,499",
    monthly: "R499/mo",
    features: [
      "Single-property website",
      "Up to 6 room types",
      "Live booking calendar",
      "PayFast payment integration",
      "WhatsApp booking alerts",
      "Basic SEO setup",
    ],
    highlighted: false,
    cta: "Get started",
  },
  {
    name: "Growth",
    tagline: "For hosts ready to scale direct revenue seriously",
    setupOriginal: "R9,999",
    setupLaunch: "R4,999",
    monthly: "R899/mo",
    features: [
      "Everything in Starter",
      "Up to 20 room types",
      "Custom booking rules and policies",
      "Email confirmation sequences",
      "Guest database with contact export",
      "Full SEO metadata + sitemap",
      "Booking analytics dashboard",
    ],
    highlighted: true,
    cta: "Get started",
    badge: "Most Popular",
  },
  {
    name: "Full Stack",
    tagline: "For multi-property operators who need full control",
    setupOriginal: "R19,999",
    setupLaunch: "R9,999",
    monthly: "R1,499/mo",
    features: [
      "Everything in Growth",
      "Multiple properties, one dashboard",
      "Channel manager sync (Airbnb, Booking.com)",
      "Custom domain + professional email setup",
      "Guest review collection system",
      "Monthly performance report",
      "Dedicated support line",
    ],
    highlighted: false,
    cta: "Get started",
  },
] as const;

export default function PackagesSummary() {
  return (
    <section className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <p
          className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-4"
          style={{ fontSize: "11px" }}
        >
          Pricing
        </p>
        <h2
          className="font-heading font-bold text-foreground leading-tight"
          style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
        >
          Simple, predictable pricing.
          <br />
          No commission. Ever.
        </h2>
        <p className="font-body text-[17px] text-muted max-w-2xl mt-5 leading-relaxed">
          One setup fee. One monthly retainer. That is the entire cost. No
          percentage of bookings, no platform cuts, no hidden charges.
        </p>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
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
              {/* Top accent bar for highlighted */}
              {pkg.highlighted && (
                <div
                  className="absolute top-0 inset-x-0 h-[3px] rounded-t-2xl"
                  style={{ backgroundColor: "var(--accent)" }}
                  aria-hidden="true"
                />
              )}

              {/* Badge */}
              {pkg.highlighted && "badge" in pkg && (
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

              {/* Name + tagline */}
              <div>
                <h3
                  className="font-heading font-extrabold text-foreground"
                  style={{ fontSize: "20px" }}
                >
                  {pkg.name}
                </h3>
                <p className="font-body text-sm text-muted mt-1 leading-relaxed">
                  {pkg.tagline}
                </p>
              </div>

              {/* Pricing */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm text-muted line-through">
                    {pkg.setupOriginal}
                  </span>
                  <span className="font-heading font-bold text-foreground text-base">
                    {pkg.setupLaunch}
                  </span>
                  <span className="font-body text-xs text-muted">once-off</span>
                </div>
                <div className="font-heading font-bold text-accent text-lg">
                  {pkg.monthly}
                </div>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2">
                {pkg.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <span
                      className="mt-1 flex-shrink-0 size-3.5 rounded-full border flex items-center justify-center"
                      style={{ borderColor: "var(--accent)" }}
                      aria-hidden="true"
                    >
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: "var(--accent)" }}
                      />
                    </span>
                    <span className="font-body text-sm text-muted leading-relaxed">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/contact"
                className="mt-2 block text-center font-heading font-bold text-sm py-3 rounded-md transition-colors tracking-wide"
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
          className="mt-6 w-full rounded-xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4"
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
              50% off every setup fee. Monthly retainer unchanged.
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

        {/* Compare link */}
        <p className="font-body text-sm text-center text-muted mt-8">
          Not sure which plan fits?{" "}
          <Link
            href="/packages"
            className="text-accent hover:underline underline-offset-2"
          >
            See the full feature comparison
          </Link>
        </p>
      </div>
    </section>
  );
}
