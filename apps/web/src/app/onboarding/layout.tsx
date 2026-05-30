import { Wordmark } from "@/components/brand/wordmark";

const STEPS = ["Profile", "Interests", "All set"];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-background relative">
      {/* Dot texture background */}
      <div
        className="fixed inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--zd-border) 1.2px, transparent 1.2px)",
          backgroundSize: "16px 16px",
        }}
      />
      {/* Top bar */}
      <div className="relative flex items-center justify-between px-8 py-6 border-b border-border bg-background/80 backdrop-blur-sm">
        <Wordmark size={20} />
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  );
}
