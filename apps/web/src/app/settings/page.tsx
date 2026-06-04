"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useLogout } from "@/hooks/use-auth";

export default function SettingsPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const logout = useLogout();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const changePassword = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      api.post("/api/settings/change-password", data).then((r) => r.data),
    onSuccess: () => {
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPwSuccess(false), 4000);
    },
  });

  const { clearAuth } = useAuthStore();
  const deleteAccount = useMutation({
    mutationFn: () => api.delete("/api/settings/account").then((r) => r.data),
    onSuccess: () => {
      clearAuth();
      router.replace("/auth/login");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-foreground mb-2">Sign in to access settings</p>
          <Link href="/auth/login" className="text-primary text-sm font-medium hover:underline">Sign in →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <h1 className="font-extrabold text-xl text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
            Settings
          </h1>
        </div>

        {/* Change password */}
        <section className="mb-6 p-5 rounded-2xl border border-border bg-card">
          <h2 className="font-semibold text-foreground mb-4">Change Password</h2>
          {pwSuccess && (
            <div className="mb-4 px-3 py-2 rounded-xl bg-green-500/10 text-green-600 text-sm">
              Password updated successfully.
            </div>
          )}
          {changePassword.error && (
            <div className="mb-4 px-3 py-2 rounded-xl bg-destructive/10 text-destructive text-sm">
              {(changePassword.error as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Failed to update password."}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Current password</label>
              <div className="relative mt-1">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={changePassword.isPending}
                  className="w-full px-3 py-2 pr-10 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">New password</label>
              <div className="relative mt-1">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={changePassword.isPending}
                  className="w-full px-3 py-2 pr-10 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <Button
              onClick={() => changePassword.mutate({ currentPassword, newPassword })}
              disabled={changePassword.isPending || !currentPassword || newPassword.length < 8}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {changePassword.isPending ? "Updating…" : "Update password"}
            </Button>
          </div>
        </section>

        {/* Sign out */}
        <section className="mb-6 p-5 rounded-2xl border border-border bg-card">
          <h2 className="font-semibold text-foreground mb-1">Sign Out</h2>
          <p className="text-sm text-muted-foreground mb-4">Sign out of your account on this device.</p>
          <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
            {logout.isPending ? "Signing out…" : "Sign out"}
          </Button>
        </section>

        {/* Delete account */}
        <section className="p-5 rounded-2xl border border-destructive/30 bg-destructive/5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={15} className="text-destructive" />
            <h2 className="font-semibold text-destructive">Delete Account</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all your redesigns. This cannot be undone.
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Type <span className="font-mono text-foreground">delete my account</span> to confirm</label>
              <input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                disabled={deleteAccount.isPending}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-destructive/30 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/30 disabled:opacity-60"
                placeholder="delete my account"
              />
            </div>
            <Button
              variant="destructive"
              onClick={() => deleteAccount.mutate()}
              disabled={deleteConfirm !== "delete my account" || deleteAccount.isPending}
            >
              {deleteAccount.isPending ? "Deleting…" : <><Trash2 size={14} />Delete account</>}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
