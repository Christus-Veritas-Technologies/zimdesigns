import CvtChevron from "@/components/cvt-chevron";
import { cn } from "@/lib/utils";

interface CvtHostsLogoProps {
  variant?: "full" | "compact";
  className?: string;
}

export default function CvtHostsLogo({
  variant = "full",
  className,
}: CvtHostsLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <CvtChevron
        size={28}
        opacity={1}
        strokeWidth={4}
        className="text-foreground flex-shrink-0"
      />
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span
            className="font-heading font-black text-foreground tracking-tight"
            style={{ fontSize: "15px" }}
          >
            CVT
          </span>
          <span
            className="font-heading font-normal text-foreground tracking-wide"
            style={{ fontSize: "15px" }}
          >
            HOSTS
          </span>
        </div>
        {variant === "full" && (
          <span
            className="font-heading font-normal text-muted tracking-[0.14em] uppercase"
            style={{ fontSize: "8px", marginTop: "2px" }}
          >
            By Christus Veritas Technologies
          </span>
        )}
      </div>
    </div>
  );
}
