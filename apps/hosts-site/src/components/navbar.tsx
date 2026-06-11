"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import CvtHostsLogo from "@/components/cvt-hosts-logo";
import ThemeToggle from "@/components/theme-toggle";

const NAV_LINKS = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Packages", href: "/packages" },
  { label: "Compare", href: "/compare" },
] as const;

const WHATSAPP_TEXT = "Hi%20CVT%20Hosts%2C%20I%27d%20like%20to%20know%20more%20about%20your%20packages.";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="CVT Hosts home">
            <CvtHostsLogo variant="compact" className="md:hidden" />
            <CvtHostsLogo variant="full" className="hidden md:flex" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-heading font-medium text-sm text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/demo"
              className="border border-border text-foreground hover:bg-surface font-heading font-medium text-sm px-5 py-2.5 rounded-md transition-colors"
            >
              See Demo
            </Link>
            <Link
              href="/contact"
              className="bg-accent text-inverse hover:bg-accent-muted font-heading font-bold text-sm px-5 py-2.5 rounded-md transition-colors tracking-wide"
            >
              Get Started
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setDrawerOpen(true)}
              className="size-9 rounded-lg flex items-center justify-center text-foreground hover:bg-subtle transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <HugeiconsIcon icon={Menu01Icon} size={22} strokeWidth={1.5} primaryColor="currentColor" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col md:hidden">
          <div className="flex items-center justify-between px-6 h-16 border-b border-border">
            <Link href="/" onClick={() => setDrawerOpen(false)}>
              <CvtHostsLogo variant="compact" />
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              className="size-9 rounded-lg flex items-center justify-center text-foreground hover:bg-subtle transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={22} strokeWidth={1.5} primaryColor="currentColor" />
            </button>
          </div>

          <nav className="flex flex-col px-6 pt-8 gap-1 flex-1 overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className="font-heading font-bold text-2xl text-foreground py-4 border-b border-border hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/demo"
              onClick={() => setDrawerOpen(false)}
              className="font-heading font-bold text-2xl text-foreground py-4 border-b border-border hover:text-accent transition-colors"
            >
              See Demo
            </Link>
            <Link
              href="/contact"
              onClick={() => setDrawerOpen(false)}
              className="font-heading font-bold text-2xl text-foreground py-4 hover:text-accent transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex flex-col gap-3 px-6 pb-8 pt-4">
            <Link
              href="/demo"
              onClick={() => setDrawerOpen(false)}
              className="w-full border border-border text-foreground hover:bg-surface font-heading font-medium text-sm px-5 py-3 rounded-md transition-colors text-center"
            >
              See Demo
            </Link>
            <Link
              href="/contact"
              onClick={() => setDrawerOpen(false)}
              className="w-full bg-accent text-inverse hover:bg-accent-muted font-heading font-bold text-sm px-5 py-3 rounded-md transition-colors text-center tracking-wide"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
