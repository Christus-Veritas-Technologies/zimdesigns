export default function PaymentIllustration({ size = 72, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      {/* Card */}
      <rect x="4" y="14" width="64" height="44" rx="8" stroke="var(--accent)" strokeWidth="1.5" />
      {/* Mag stripe */}
      <rect x="4" y="24" width="64" height="8" fill="var(--accent)" fillOpacity="0.1" />
      {/* Chip */}
      <rect x="10" y="36" width="18" height="13" rx="3" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="1" />
      <line x1="10" y1="42.5" x2="28" y2="42.5" stroke="var(--accent)" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="19" y1="36" x2="19" y2="49" stroke="var(--accent)" strokeWidth="0.8" strokeOpacity="0.5" />
      {/* Card number dots */}
      {[0, 1, 2, 3].map((group) =>
        [0, 1, 2, 3].map((dot) => (
          <circle
            key={`${group}-${dot}`}
            cx={36 + group * 9 + dot * 2}
            cy={50}
            r="1.2"
            fill="var(--accent)"
            fillOpacity="0.4"
          />
        ))
      )}
      {/* Logo placeholder top-right */}
      <circle cx="60" cy="21" r="5" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="56" cy="21" r="5" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  );
}
