"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Ban, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminUsers, useBanUser, useUnbanUser } from "@/hooks/use-admin";
import type { AdminUser } from "@/hooks/use-admin";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

const ROLE_LABEL: Record<string, string> = {
  designer: "Designer",
  developer: "Developer",
  both: "Designer & Dev",
};

function Avatar({ user, size = 32 }: { user: AdminUser; size?: number }) {
  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  if (user.avatarUrl) {
    return (
      <Image
        src={absoluteUrl(user.avatarUrl)}
        alt={user.name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        unoptimized
      />
    );
  }
  return (
    <div
      className="rounded-full bg-primary/20 flex items-center justify-center flex-none font-semibold text-primary"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

function BanButton({ user }: { user: AdminUser }) {
  const ban = useBanUser();
  const unban = useUnbanUser();
  const [confirm, setConfirm] = useState(false);

  if (user.banned) {
    return (
      <button
        onClick={() => unban.mutate(user.id)}
        disabled={unban.isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
      >
        <CheckCircle size={13} className="text-green-500" />
        {unban.isPending ? "Unbanning…" : "Unban"}
      </button>
    );
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => { ban.mutate(user.id); setConfirm(false); }}
          disabled={ban.isPending}
          className="px-2.5 py-1 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90 transition-colors disabled:opacity-50"
        >
          {ban.isPending ? "…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="px-2.5 py-1 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/40 text-xs font-semibold text-destructive hover:bg-destructive/5 transition-colors"
    >
      <Ban size={13} />
      Ban
    </button>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar user={user} size={32} />
          <div>
            <p className="font-semibold text-sm text-foreground leading-tight">{user.name}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{user.email}</td>
      <td className="px-4 py-3 hidden md:table-cell">
        {user.role && (
          <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wide">
            {ROLE_LABEL[user.role] ?? user.role}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{user._count.redesigns}</td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${user.banned ? "bg-destructive/10 text-destructive" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
          {user.banned ? "Banned" : "Active"}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <BanButton user={user} />
      </td>
    </tr>
  );
}

function UserCard({ user }: { user: AdminUser }) {
  return (
    <div className={`rounded-2xl border bg-card p-4 flex flex-col gap-3 ${user.banned ? "border-destructive/30 opacity-75" : "border-border"}`}>
      <div className="flex items-center gap-3">
        <Avatar user={user} size={44} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground">@{user.username}</p>
        </div>
        <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full flex-none ${user.banned ? "bg-destructive/10 text-destructive" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
          {user.banned ? "Banned" : "Active"}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="truncate">{user.email}</span>
        {user.role && (
          <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wide flex-none ml-2">
            {ROLE_LABEL[user.role] ?? user.role}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{user._count.redesigns} redesigns · {user._count.followers} followers</span>
        <BanButton user={user} />
      </div>
    </div>
  );
}

export default function AdminDesignersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"table" | "cards">("table");

  const { data, isLoading } = useAdminUsers({ page, search: debouncedSearch || undefined });

  function handleSearch(val: string) {
    setSearch(val);
    clearTimeout((window as Window & { _searchTimeout?: ReturnType<typeof setTimeout> })._searchTimeout);
    (window as Window & { _searchTimeout?: ReturnType<typeof setTimeout> })._searchTimeout = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 300);
  }

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl">
      <div className="mb-6">
        <h1
          className="text-2xl font-extrabold text-foreground"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}
        >
          Designers
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">All registered users — designers, developers, and both.</p>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search users…"
            className="w-full h-9 pl-8 pr-3 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all"
          />
        </div>
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${view === "table" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Table
          </button>
          <button
            onClick={() => setView("cards")}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors border-l border-border ${view === "cards" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Cards
          </button>
        </div>
        {data && (
          <span className="text-xs text-muted-foreground">{data.total} users</span>
        )}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && data && data.users.length === 0 && (
        <div className="text-center py-20">
          <p className="font-semibold text-foreground">No users found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different search term.</p>
        </div>
      )}

      {!isLoading && data && data.users.length > 0 && (
        <>
          {view === "table" ? (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">User</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Email</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Role</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Redesigns</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Status</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
