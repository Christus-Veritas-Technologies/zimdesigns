export default function WhatsappIllustration({ size = 72, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      {/* Main bubble */}
      <rect x="6" y="6" width="54" height="36" rx="14" fill="var(--accent)" fillOpacity="0.07" stroke="var(--accent)" strokeWidth="1.5" />
      {/* Bubble tail */}
      <path d="M 16,42 L 10,54 L 24,44" fill="var(--accent)" fillOpacity="0.07" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Message lines inside bubble */}
      <rect x="16" y="15" width="34" height="4" rx="2" fill="var(--accent)" fillOpacity="0.25" />
      <rect x="16" y="23" width="26" height="4" rx="2" fill="var(--accent)" fillOpacity="0.18" />
      {/* Double tick */}
      <polyline points="32,60 36,64 44,56" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="38,60 42,64 50,56" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
