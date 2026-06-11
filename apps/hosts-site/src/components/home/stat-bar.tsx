import { HugeiconsIcon } from "@hugeicons/react";
import { MoneySend01Icon, UserMultiple02Icon, ChartIncreaseIcon } from "@hugeicons/core-free-icons";

const STATS = [
  {
    icon: MoneySend01Icon,
    value: "R72,000+",
    label: "Lost to OTA commissions annually by the average SA guest house",
  },
  {
    icon: UserMultiple02Icon,
    value: "100%",
    label: "Of your direct booking guests — their details belong to you, not the platform",
  },
  {
    icon: ChartIncreaseIcon,
    value: "R899/month",
    label: "Is all it costs to run a complete direct booking system with payments",
  },
] as const;

export default function StatBar() {
  return (
    <div className="w-full bg-surface border-y border-border">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="py-8 px-6 flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left"
            >
              <div
                className="flex-shrink-0 size-11 rounded-xl flex items-center justify-center mt-0.5"
                style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
              >
                <HugeiconsIcon
                  icon={stat.icon}
                  size={24}
                  strokeWidth={1.5}
                  primaryColor="var(--accent)"
                />
              </div>
              <div>
                <p className="font-heading font-black text-4xl text-foreground leading-none">
                  {stat.value}
                </p>
                <p className="font-body text-sm text-muted mt-1.5 max-w-[200px] leading-relaxed">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
