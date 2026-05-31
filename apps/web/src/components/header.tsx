"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ListChecks, Bell, Settings, LogOut, User, ChevronDown, LogIn } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useCurrentUser, useIsAuthenticated, useLogout } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

function UserMenu() {
  const user = useCurrentUser();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-accent transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-none">
          {user.avatarUrl ? (
            <Image src={absoluteUrl(user.avatarUrl)} alt={user.name} width={28} height={28} className="object-cover" unoptimized />
          ) : (
            <span className="text-xs font-extrabold text-primary">{user.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <span className="text-sm font-medium text-foreground hidden sm:block max-w-[100px] truncate">{user.name}</span>
        <ChevronDown size={13} className="text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border bg-card shadow-xl z-50 py-1 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
          </div>
          <Link href={`/users/${user.username}`} onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors">
            <User size={14} className="text-muted-foreground" /> Profile
          </Link>
          <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors">
            <Settings size={14} className="text-muted-foreground" /> Settings
          </Link>
          <div className="border-t border-border mt-1" />
          <button
            onClick={() => { setOpen(false); logout.mutate(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-accent transition-colors"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function NotificationDot() {
  const isAuthenticated = useIsAuthenticated();
  const { data: notifications } = useNotifications();
  const unread = notifications?.filter((n) => !n.read).length ?? 0;
  if (!isAuthenticated || unread === 0) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
      {unread > 9 ? "9+" : unread}
    </span>
  );
}

export default function Header() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-lg text-foreground tracking-tight flex-none" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
          Zim<span className="text-primary">Designs</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link href="/trending" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <TrendingUp size={14} /> Trending
          </Link>
          <Link href="/app-requests" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <ListChecks size={14} /> Requests
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isAuthenticated ? (
            <>
              <Link href="/notifications" className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Bell size={17} />
                <NotificationDot />
              </Link>
              <UserMenu />
            </>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <LogIn size={14} /> Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
