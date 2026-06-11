export default function WebsiteIllustration({ size = 72, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      {/* Browser frame */}
      <rect x="4" y="8" width="64" height="52" rx="6" stroke="var(--accent)" strokeWidth="1.5" />
      {/* Title bar */}
      <line x1="4" y1="22" x2="68" y2="22" stroke="var(--accent)" strokeWidth="1.5" />
      {/* Dots */}
      <circle cx="14" cy="15" r="2.5" fill="var(--accent)" fillOpacity="0.5" />
      <circle cx="22" cy="15" r="2.5" fill="var(--accent)" fillOpacity="0.5" />
      <circle cx="30" cy="15" r="2.5" fill="var(--accent)" fillOpacity="0.5" />
      {/* Address bar */}
      <rect x="38" y="11" width="22" height="8" rx="2" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.4" />
      {/* Content lines */}
      <rect x="12" y="30" width="48" height="4" rx="2" fill="var(--accent)" fillOpacity="0.2" />
      <rect x="12" y="38" width="40" height="3" rx="1.5" fill="var(--accent)" fillOpacity="0.15" />
      <rect x="12" y="44" width="32" height="3" rx="1.5" fill="var(--accent)" fillOpacity="0.15" />
      {/* Right image placeholder */}
      <rect x="40" y="36" width="22" height="16" rx="3" fill="var(--accent)" fillOpacity="0.1" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  );
}
