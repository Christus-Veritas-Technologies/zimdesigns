"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, MessageSquarePlus, AppWindow, Layers, Users, Flag } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";

const NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, badge: null },
  { label: "App requests", href: "/admin/requests", icon: MessageSquarePlus, badge: 12 },
  { label: "Original apps", href: "/admin/apps", icon: AppWindow, badge: null },
  { label: "Redesigns", href: "/admin/redesigns", icon: Layers, badge: null },
  { label: "Designers", href: "/admin/designers", icon: Users, badge: null },
  { label: "Reports", href: "/admin/reports", icon: Flag, badge: 3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) return null;
  if (user.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 flex-none border-r border-border flex flex-col py-6 px-3 sticky top-0 h-screen">
        <div className="px-3 mb-6">
          <span className="text-[0.6rem] font-bold tracking-widest text-muted-foreground uppercase">Admin Console</span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ label, href, icon: Icon, badge }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={15} />
                  {label}
                </span>
                {badge != null && (
                  <span className="text-[0.6rem] font-bold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
