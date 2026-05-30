import { cn } from "@zimdesigns/ui/lib/utils";

interface FlagBarProps {
  height?: number;
  width?: number;
  className?: string;
}

export function FlagBar({ height = 5, width, className }: FlagBarProps) {
  return (
    <div
      className={cn("flex overflow-hidden rounded-full", className)}
      style={{ height, ...(width ? { width } : {}) }}
    >
      <i className="flex-1 bg-[var(--zd-gold)]" />
      <i className="flex-1 bg-[var(--zd-green)]" />
      <i className="flex-1 bg-[oklch(0.22_0.01_75)]" />
      <i className="flex-1 bg-[oklch(0.97_0.003_95)]" />
    </div>
  );
}
