import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  UserRemove01Icon,
  MoneyRemove01Icon,
  ChartDecreaseIcon,
} from "@hugeicons/core-free-icons";

const PROBLEMS = [
  {
    icon: UserRemove01Icon,
    headline: "You do not own the guest",
    body: "Their contact details belong to Booking.com. When they return, they go back to the platform. You pay commission on a guest you already earned.",
  },
  {
    icon: MoneyRemove01Icon,
    headline: "You pay on every booking, forever",
    body: "There is no ceiling. No point at which you have paid enough. The more successful your property becomes, the more you hand over.",
  },
  {
    icon: ChartDecreaseIcon,
    headline: "Your rates are not fully yours",
    body: "Visibility programmes on the platform require you to discount your rates on top of commission. You pay to be seen and reduce your margin to be chosen.",
  },
] as const;

export default function ProblemSection() {
  return (
    <section className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <p
          className="font-heading font-normal text-muted uppercase tracking-[0.2em] mb-4"
          style={{ fontSize: "11px" }}
        >
          The Real Cost
        </p>
        <h2
          className="font-heading font-bold text-foreground leading-tight"
          style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
        >
          Booking.com is not your partner.
          <br />
          It is your most expensive cost.
        </h2>
        <p className="font-body text-[17px] text-muted max-w-2xl mt-5 leading-relaxed">
          You listed your property to get bookings. That worked. But every year
          you stay on the platform, the arrangement costs you more — not just in
          commission, but in guests you cannot contact, relationships you cannot
          build, and revenue that belongs to you but never arrives.
        </p>

        {/* Danger callout */}
        <div
          className="mt-8 rounded-r-xl p-5 flex gap-4 items-start"
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
            A guest house doing{" "}
            <strong className="text-foreground">
              R30,000 per month in bookings
            </strong>{" "}
            pays up to{" "}
            <strong className="text-foreground">R6,000 in commission</strong>{" "}
            every single month. That is R72,000 a year — for guests who will
            book through the same platform again next time and cost you again.
          </p>
        </div>

        {/* Problem cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROBLEMS.map((problem, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4"
            >
              <div
                className="size-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(224,92,58,0.08)" }}
              >
                <HugeiconsIcon
                  icon={problem.icon}
                  size={24}
                  strokeWidth={1.5}
                  primaryColor="var(--danger)"
                />
              </div>
              <h3 className="font-heading font-bold text-[17px] text-foreground leading-snug">
                {problem.headline}
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                {problem.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
