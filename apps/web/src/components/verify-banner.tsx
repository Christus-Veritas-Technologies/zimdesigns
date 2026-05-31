"use client";

import { useState } from "react";
import { Mail, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth";

export default function VerifyBanner() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [dismissed, setDismissed] = useState(false);
  const [sent, setSent] = useState(false);

  const sendVerification = useMutation({
    mutationFn: () => api.post("/api/auth/send-verification").then((r) => r.data),
    onSuccess: () => setSent(true),
  });

  // Only show if authenticated but email not verified
  if (!user || !accessToken || (user as { emailVerified?: boolean }).emailVerified || dismissed) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/50">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <Mail size={15} className="text-amber-600 dark:text-amber-400 flex-none" />
        <p className="text-sm text-amber-800 dark:text-amber-300 flex-1">
          Please verify your email address to unlock all features.{" "}
          {sent ? (
            <span className="font-medium">Verification email sent — check your inbox!</span>
          ) : (
            <button
              onClick={() => sendVerification.mutate()}
              disabled={sendVerification.isPending}
              className="font-semibold underline hover:no-underline transition-all"
            >
              {sendVerification.isPending ? "Sending…" : "Resend verification email"}
            </button>
          )}
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors flex-none"
          aria-label="Dismiss"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
