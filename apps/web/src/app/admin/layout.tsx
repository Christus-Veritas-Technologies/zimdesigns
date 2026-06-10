"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquarePlus, AppWindow, Layers, Users, Flag, LogOut } from "lucide-react";
import { adminLogout } from "./login/actions";

const NAV = [
  { label: "Overview",      href: "/admin",           icon: LayoutDashboard },
  { label: "App requests",  href: "/admin/requests",  icon: MessageSquarePlus },
  { label: "Original apps", href: "/admin/apps",      icon: AppWindow },
  { label: "Redesigns",     href: "/admin/redesigns", icon: Layers },
  { label: "Designers",     href: "/admin/designers", icon: Users },
  { label: "Reports",       href: "/admin/reports",   icon: Flag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* ── Mobile header + horizontal tab bar ── */}
      <div className="md:hidden border-b border-border bg-card sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">
            Admin Console
          </span>
          <form action={adminLogout}>
            <button type="submit" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <LogOut size={12} /> Sign out
            </button>
          </form>
        </div>
        <div className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex-none flex flex-col items-center gap-0.5 px-4 py-2.5 text-[0.65rem] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Desktop sidebar + main ── */}
      <div className="hidden md:flex min-h-screen">
        <aside className="w-56 flex-none border-r border-border flex flex-col py-6 px-3 sticky top-0 h-screen">
          <div className="px-3 mb-6">
            <span className="text-[0.6rem] font-bold tracking-widest text-muted-foreground uppercase">
              Admin Console
            </span>
          </div>
          <nav className="flex flex-col gap-0.5 flex-1">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <form action={adminLogout} className="px-3 pt-4 border-t border-border">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full py-2 transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          </form>
        </aside>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile content below tab bar */}
      <div className="md:hidden">{children}</div>
    </div>
  );
}
