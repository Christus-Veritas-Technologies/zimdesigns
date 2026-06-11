import Link from "next/link";

import CvtHostsLogo from "@/components/cvt-hosts-logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center gap-6">
      <CvtHostsLogo />

      <div className="flex flex-col gap-3">
        <p
          className="font-heading font-black leading-none text-accent select-none"
          style={{ fontSize: "clamp(80px, 16vw, 140px)" }}
          aria-hidden="true"
        >
          404
        </p>
        <h1 className="font-heading font-bold text-2xl text-foreground -mt-2">
          Page not found.
        </h1>
        <p className="font-body text-[15px] text-muted max-w-sm mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
        <Link
          href="/"
          className="bg-accent text-inverse hover:bg-accent-muted font-heading font-bold text-sm px-6 py-2.5 rounded-md transition-colors"
        >
          Back to home
        </Link>
        <Link
          href="/packages"
          className="border border-border text-foreground hover:bg-surface font-heading font-medium text-sm px-6 py-2.5 rounded-md transition-colors"
        >
          View Packages
        </Link>
      </div>
    </div>
  );
}
