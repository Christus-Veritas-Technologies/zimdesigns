"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Smartphone } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { FlagBar } from "@/components/brand/flag-bar";

// Native OAuth callback: the server redirects here after Google sign-in triggered
// from the native app.  This page fires the zimdesigns:// deep link so the native
// app can catch the tokens and resume.  The user never "arrives" here — it should
// auto-dismiss in under a second.  The fallback copy is shown if the deep link
// doesn't fire (e.g., browser can't open the scheme).
export default function NativeCallbackPage() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"redirecting" | "done" | "manual">("redirecting");

  useEffect(() => {
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const userId = params.get("userId");
    const onboardingComplete = params.get("onboardingComplete") ?? "false";

    if (!token || !refreshToken || !userId) {
      setStatus("manual");
      return;
    }

    const deepLink =
      `zimdesigns://auth/callback?` +
      new URLSearchParams({ token, refreshToken, userId, onboardingComplete }).toString();

    // Try to fire the deep link immediately
    window.location.href = deepLink;

    // If we're still here after 1.5s the deep link didn't dismiss the browser;
    // show a manual-tap fallback.
    const t = setTimeout(() => setStatus("manual"), 1500);

    // Mark done so we don't flicker if the redirect fires fast
    const t2 = setTimeout(() => setStatus("done"), 400);

    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [params]);

  const token = params.get("token");
  const refreshToken = params.get("refreshToken");
  const userId = params.get("userId");
  const onboardingComplete = params.get("onboardingComplete") ?? "false";

  const deepLink = token
    ? `zimdesigns://auth/callback?` +
      new URLSearchParams({ token: token!, refreshToken: refreshToken!, userId: userId!, onboardingComplete }).toString()
    : null;

  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-8 px-6 bg-background">
      <Wordmark size={24} />

      {status === "redirecting" && (
        <div className="flex flex-col items-center gap-3 text-center">
          <Smartphone size={48} className="text-[var(--zd-gold)]" />
          <p className="text-lg font-semibold">Returning to ZimDesigns…</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            The app should open automatically. Keep this tab open until it does.
          </p>
        </div>
      )}

      {status === "done" && (
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle2 size={48} className="text-[var(--zd-green)]" />
          <p className="text-lg font-semibold">All set!</p>
          <p className="text-sm text-muted-foreground">You can close this tab.</p>
        </div>
      )}

      {status === "manual" && (
        <div className="flex flex-col items-center gap-5 text-center max-w-sm">
          <Smartphone size={48} className="text-[var(--zd-gold)]" />
          <div>
            <p className="text-lg font-semibold">Almost there</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Tap the button below to open ZimDesigns and complete sign-in.
            </p>
          </div>
          {deepLink && (
            <a
              href={deepLink}
              className="w-full max-w-[280px] h-12 flex items-center justify-center rounded-xl bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] font-semibold text-base"
            >
              Open ZimDesigns
            </a>
          )}
          <p className="text-xs text-muted-foreground">
            You can close this tab after the app opens.
          </p>
        </div>
      )}

      <FlagBar width={72} height={5} />
    </div>
  );
}
