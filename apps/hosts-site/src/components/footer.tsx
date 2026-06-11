import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { WhatsappIcon, Mail01Icon, MapsLocation01Icon } from "@hugeicons/core-free-icons";

import { env } from "@/env";
import CvtHostsLogo from "@/components/cvt-hosts-logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Packages", href: "/packages" },
  { label: "Compare", href: "/compare" },
  { label: "Demo", href: "/demo" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Footer() {
  const waNumber = env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const waHref = `https://wa.me/${waNumber}?text=Hi%20CVT%20Hosts%2C%20I%27d%20like%20to%20know%20more%20about%20your%20packages.`;

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-[1100px] mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
          {/* Brand */}
          <div>
            <CvtHostsLogo variant="full" />
            <p className="font-body text-sm text-muted mt-4 max-w-[260px] leading-relaxed">
              CVT Hosts is a service by Christus Veritas Technologies.
              Built for South African guest houses.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-heading font-normal text-muted text-xs tracking-[0.18em] uppercase mb-4">
              Navigation
            </p>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-heading font-normal text-muted text-xs tracking-[0.18em] uppercase mb-4">
              Contact
            </p>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 font-body text-sm text-muted hover:text-foreground transition-colors group"
                >
                  <HugeiconsIcon
                    icon={WhatsappIcon}
                    size={18}
                    strokeWidth={1.5}
                    primaryColor="currentColor"
                    className="text-accent group-hover:text-accent flex-shrink-0"
                  />
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:hosts@christusveritas.tech"
                  className="flex items-center gap-2.5 font-body text-sm text-muted hover:text-foreground transition-colors"
                >
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={18}
                    strokeWidth={1.5}
                    primaryColor="currentColor"
                    className="flex-shrink-0"
                  />
                  hosts@christusveritas.tech
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2.5 font-body text-sm text-muted">
                  <HugeiconsIcon
                    icon={MapsLocation01Icon}
                    size={18}
                    strokeWidth={1.5}
                    primaryColor="currentColor"
                    className="flex-shrink-0"
                  />
                  Serving SA properties
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-muted text-center md:text-left">
            &copy; 2026 Christus Veritas Technologies. All rights reserved.
          </p>
          <p className="font-body text-xs text-muted text-center md:text-right">
            Payments processed via PayFast &middot; POPIA Compliant &middot; South African Owned
          </p>
        </div>
      </div>
    </footer>
  );
}
