import Image from "next/image";
import { cn } from "@zimdesigns/ui/lib/utils";

interface WordmarkProps {
  size?: number;
  className?: string;
}

export function Wordmark({ size = 22, className }: WordmarkProps) {
  const markSize = Math.round(size * 1.35);
  return (
    <span
      className={cn("inline-flex items-center gap-2 font-extrabold tracking-tight", className)}
      style={{
        fontSize: size,
        fontFamily: "'Bricolage Grotesque', 'Hanken Grotesk', system-ui, sans-serif",
        letterSpacing: "-0.03em",
      }}
    >
      <span className="inline-flex rounded-xl overflow-hidden flex-none" style={{ width: markSize, height: markSize }}>
        <Image src="/zd-icon.png" width={markSize} height={markSize} alt="" unoptimized />
      </span>
      <span className="text-foreground">
        Zim<b className="text-[var(--zd-gold)]">Designs</b>
      </span>
    </span>
  );
}
