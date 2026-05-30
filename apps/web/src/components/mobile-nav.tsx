"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Bell, User, Search } from "lucide-react";
import { useIsAuthenticated, useCurrentUser } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@zimdesigns/ui/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();
  const { data: notifications } = useNotifications();
  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  const isAuth = pathname.startsWith("/auth") || pathname.startsWith("/onboarding");
  if (isAuth) return null;

  const items = [
    { href: "/", icon: Home, label: "Home", active: pathname === "/" },
    { href: "/search", icon: Search, label: "Search", active: pathname === "/search" },
    { href: "/trending", icon: Compass, label: "Discover", active: pathname.startsWith("/trending") || pathname.startsWith("/app-requests") },
    ...(isAuthenticated
      ? [
          {
            href: "/notifications",
            icon: Bell,
            label: "Alerts",
            active: pathname === "/notifications",
            badge: unread,
          },
          {
            href: currentUser ? `/users/${currentUser.username}` : "/auth/login",
            icon: User,
            label: "Profile",
            active: pathname.startsWith("/users/") || pathname.startsWith("/profile") || pathname === "/settings",
          },
        ]
      : [
          {
            href: "/auth/login",
            icon: User,
            label: "Sign in",
            active: pathname.startsWith("/auth"),
          },
        ]),
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 xl:hidden border-t border-border bg-background/90 backdrop-blur-sm">
      <div className="flex items-center justify-around px-2 py-1 max-w-sm mx-auto">
        {items.map(({ href, icon: Icon, label, active, badge }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[0.6rem] font-medium">{label}</span>
            {typeof badge === "number" && badge > 0 && (
              <span className="absolute top-1 right-1.5 w-4 h-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
                {badge > 9 ? "9+" : badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
