import { cn } from "@zimdesigns/ui/lib/utils";

interface StepsBarProps {
  current: 1 | 2 | 3;
  className?: string;
}

export function StepsBar({ current, className }: StepsBarProps) {
  return (
    <div className={cn("flex items-center gap-2 w-full", className)}>
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={cn(
            "flex-1 h-1.5 rounded-full transition-all duration-300",
            step < current && "bg-[var(--zd-green)]",
            step === current && "bg-[var(--zd-gold)]",
            step > current && "bg-border",
          )}
        />
      ))}
    </div>
  );
}
