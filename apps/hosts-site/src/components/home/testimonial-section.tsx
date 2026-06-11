export default function TestimonialSection() {
  return (
    <section className="py-24">
      <div className="max-w-[800px] mx-auto px-6">
        <p
          className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-10 text-center"
          style={{ fontSize: "11px" }}
        >
          From Our Hosts
        </p>

        <div
          className="rounded-2xl p-8 md:p-12"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--accent)",
          }}
        >
          <blockquote>
            <p
              className="font-display italic leading-relaxed text-foreground"
              style={{ fontSize: "clamp(17px, 2.2vw, 22px)" }}
            >
              &ldquo;Before CVT Hosts, every booking from Booking.com felt like
              a win, but I was handing over almost R8,000 a month in commission.
              That&apos;s money I earned, that my property earned, going to a
              platform that owns the guest relationship. Now I take bookings
              directly, the money lands in my account immediately, and I know my
              guests by name. It has genuinely changed how the business
              works.&rdquo;
            </p>
            <footer className="mt-8 flex items-center gap-4">
              <div
                className="size-12 rounded-full flex-shrink-0 flex items-center justify-center font-heading font-bold text-sm"
                style={{
                  backgroundColor: "rgba(201,168,76,0.15)",
                  color: "var(--accent)",
                }}
                aria-hidden="true"
              >
                NM
              </div>
              <div>
                <p className="font-heading font-bold text-sm text-foreground">
                  Nompumelelo M.
                </p>
                <p className="font-body text-xs text-muted mt-0.5">
                  Owner, The Hilltop Guest House — Johannesburg
                </p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
