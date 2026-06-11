export default function CalendarIllustration({ size = 72, className = "" }: { size?: number; className?: string }) {
  const cells = [
    { x: 10, y: 32 }, { x: 22, y: 32 }, { x: 34, y: 32 }, { x: 46, y: 32 }, { x: 58, y: 32 },
    { x: 10, y: 44 }, { x: 22, y: 44 }, { x: 34, y: 44 }, { x: 46, y: 44 }, { x: 58, y: 44 },
    { x: 10, y: 56 }, { x: 22, y: 56 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      {/* Frame */}
      <rect x="4" y="8" width="64" height="60" rx="5" stroke="var(--accent)" strokeWidth="1.5" />
      {/* Header fill */}
      <rect x="4" y="8" width="64" height="18" rx="5" fill="var(--accent)" fillOpacity="0.12" />
      <rect x="4" y="18" width="64" height="8" fill="var(--accent)" fillOpacity="0.12" />
      {/* Hooks */}
      <rect x="18" y="3" width="4" height="9" rx="2" fill="var(--accent)" fillOpacity="0.5" />
      <rect x="50" y="3" width="4" height="9" rx="2" fill="var(--accent)" fillOpacity="0.5" />
      {/* Month label */}
      <rect x="20" y="13" width="32" height="5" rx="2" fill="var(--accent)" fillOpacity="0.3" />
      {/* Day cells */}
      {cells.map((cell, i) => (
        <rect
          key={i}
          x={cell.x}
          y={cell.y}
          width="10"
          height="9"
          rx="2"
          fill={i === 7 ? "var(--accent)" : "var(--accent)"}
          fillOpacity={i === 7 ? 0.35 : 0.1}
          stroke={i === 7 ? "var(--accent)" : "none"}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
