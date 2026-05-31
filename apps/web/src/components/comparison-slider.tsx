"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { GripVertical } from "lucide-react";

interface Props {
  beforeUrl: string;
  afterUrl: string;
  alt?: string;
}

export default function ComparisonSlider({ beforeUrl, afterUrl, alt = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50); // percent
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    updatePosition(e.clientX);
    const onMove = (ev: MouseEvent) => { if (dragging.current) updatePosition(ev.clientX); };
    const onUp = () => { dragging.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const onMove = (ev: TouchEvent) => updatePosition(ev.touches[0].clientX);
    const onEnd = () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted select-none cursor-col-resize"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* After (full width, underneath) */}
      <Image src={afterUrl} alt={`${alt} — after`} fill className="object-contain pointer-events-none" unoptimized />

      {/* Before (clipped to left of slider) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={beforeUrl} alt={`${alt} — before`} fill className="object-contain pointer-events-none" unoptimized />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center pointer-events-none z-10"
        style={{ left: `${position}%` }}
      >
        <GripVertical size={16} className="text-muted-foreground rotate-90" />
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <span className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">Before</span>
      </div>
      <div className="absolute top-3 right-3 pointer-events-none">
        <span className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">After</span>
      </div>
    </div>
  );
}
