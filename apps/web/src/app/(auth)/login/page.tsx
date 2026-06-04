"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/button";
import { Input } from "@zimdesigns/ui/components/input";
import { Label } from "@zimdesigns/ui/components/label";
import { Wordmark } from "@/components/brand/wordmark";
import { FlagBar } from "@/components/brand/flag-bar";
import { useLogin } from "@/hooks/use-auth";
import { env } from "@zimdesigns/env/web";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C39.9 36.5 44 31 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const login = useLogin();

  const handleGoogleAuth = () => {
    setIsGoogleLoading(true);
    window.location.href = `${env.NEXT_PUBLIC_SERVER_URL}/api/auth/google`;
  };

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden md:grid md:grid-cols-[1.05fr_1fr] min-h-svh">
        {/* Brand panel — same as signup */}
        <div className="relative bg-[var(--zd-bg-alt)] border-r border-border p-12 flex flex-col overflow-hidden">
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(oklch(0.905 0.006 90) 1.2px, transparent 1.2px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative flex flex-col h-full">
            <Wordmark size={24} />
            <div className="mt-auto max-w-[440px]">
              <h1
                className="text-[2.4rem] font-extrabold leading-[1.08] tracking-tight text-foreground"
                style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
              >
                Welcome back.
              </h1>
              <p className="mt-4 text-[1.05rem] text-muted-foreground leading-[1.55]">
                Sign in to keep improving the apps Zimbabwe uses every day.
              </p>
            </div>
            <div className="mt-auto pt-8 flex items-center gap-4">
              <FlagBar width={64} height={5} />
              <span className="text-xs font-mono tracking-wider text-muted-foreground uppercase">
                The redesign movement
              </span>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center px-14 py-12">
          <div className="w-full max-w-[380px] mx-auto">
            <h2
              className="text-[1.85rem] font-extrabold tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
              Sign in
            </h2>
            <p className="mt-1.5 mb-7 text-[0.98rem] text-muted-foreground">
              Continue to your ZimDesigns account.
            </p>
            <LoginForm showPw={showPw} setShowPw={setShowPw} form={form} setForm={setForm}
              login={login} handleGoogleAuth={handleGoogleAuth} isGoogleLoading={isGoogleLoading} />
            <p className="text-center mt-5 text-[0.92rem] text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold underline decoration-[var(--zd-gold)] underline-offset-2">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden min-h-svh px-6 pt-6 pb-5 flex flex-col bg-background">
        <div className="flex items-center justify-between">
          <Wordmark size={19} />
          <FlagBar width={40} height={4} />
        </div>
        <div className="mt-6">
          <h1
            className="text-[1.65rem] font-extrabold tracking-tight"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            Welcome back.
          </h1>
          <p className="mt-2 text-[0.93rem] text-muted-foreground">
            Sign in to your ZimDesigns account.
          </p>
        </div>
        <div className="mt-6 flex-1">
          <LoginForm compact showPw={showPw} setShowPw={setShowPw} form={form}
            setForm={setForm} login={login} handleGoogleAuth={handleGoogleAuth} isGoogleLoading={isGoogleLoading} />
        </div>
        <p className="text-center mt-4 text-[0.9rem] text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold underline decoration-[var(--zd-gold)] underline-offset-2">Sign up</Link>
        </p>
      </div>
    </>
  );
}

function LoginForm({
  showPw, setShowPw, form, setForm, login, handleGoogleAuth, isGoogleLoading, compact = false,
}: {
  showPw: boolean;
  setShowPw: (v: boolean) => void;
  form: { email: string; password: string };
  setForm: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  login: ReturnType<typeof useLogin>;
  handleGoogleAuth: () => void;
  isGoogleLoading: boolean;
  compact?: boolean;
}) {
  const gap = compact ? "gap-3.5" : "gap-4";
  const busy = login.isPending || isGoogleLoading;
  return (
    <form
      className={`flex flex-col ${gap}`}
      onSubmit={(e) => { e.preventDefault(); login.mutate(form); }}
    >
      <button type="button" onClick={handleGoogleAuth} disabled={isGoogleLoading || login.isPending}
        className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors font-semibold text-[0.95rem] text-foreground cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
        {isGoogleLoading ? <span className="w-4 h-4 rounded-full border-2 border-foreground/30 border-t-foreground animate-spin" /> : <GoogleIcon />}
        {isGoogleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="flex-1 h-px bg-border" />
        <span className="text-xs font-mono tracking-wider uppercase">or</span>
        <span className="flex-1 h-px bg-border" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-[0.84rem] font-semibold">Email</Label>
        <Input id="email" type="email" placeholder="you@email.com" value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required disabled={busy} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password" className="text-[0.84rem] font-semibold">
          <span>Password</span>
          <Link href="/forgot-password" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto">
            Forgot password?
          </Link>
        </Label>
        <div className="relative flex items-center">
          <Input id="password" type={showPw ? "text" : "password"} placeholder="Your password"
            className="pr-10" value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required disabled={busy} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPw ? "Hide password" : "Show password"}>
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {login.isError && (
        <p className="text-sm text-destructive">
          {(login.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Invalid email or password."}
        </p>
      )}

      <Button type="submit" disabled={login.isPending}
        className="h-12 text-base font-semibold bg-[var(--zd-gold)] hover:bg-[var(--zd-gold-hover)] text-[var(--zd-gold-fg)] rounded-xl mt-1 flex flex-row-reverse items-center gap-2">
        <ArrowRight size={18} />
        {login.isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
