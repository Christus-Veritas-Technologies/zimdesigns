"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Flag } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/button";
import { Input } from "@zimdesigns/ui/components/input";
import { Label } from "@zimdesigns/ui/components/label";
import { Wordmark } from "@/components/brand/wordmark";
import { FlagBar } from "@/components/brand/flag-bar";
import { useSignup } from "@/hooks/use-auth";
import { env } from "@zimdesigns/env/web";

const MISSION = "Zimbabwe has talented designers and developers. Let's fix the apps we use every day.";

function AppCard({ accent = "gold", rotate = 0 }: { accent?: "gold" | "green"; rotate?: number }) {
  const topColor = accent === "gold" ? "var(--zd-gold)" : "var(--zd-green)";
  const altColor = accent === "gold" ? "var(--zd-green)" : "var(--zd-gold)";
  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-md"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="h-1.5 flex">
        <span className="flex-1" style={{ background: topColor }} />
        <span className="flex-1" style={{ background: altColor }} />
        <span className="flex-1 bg-muted" />
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="h-2 w-3/5 rounded" style={{ background: "var(--zd-mock-a)" }} />
        <div className="h-8 rounded-lg" style={{ background: "var(--zd-mock-b)" }} />
        {[85, 70, 55].map((w, i) => (
          <div key={i} className="h-1.5 rounded" style={{ width: `${w}%`, background: "var(--zd-mock-a)" }} />
        ))}
        <div className="mt-auto pt-2 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 h-3 rounded"
              style={{ background: i === 0 ? topColor : "var(--zd-mock-a)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GoogleButton() {
  const handleGoogleAuth = () => {
    window.location.href = `${env.NEXT_PUBLIC_SERVER_URL}/api/auth/google`;
  };
  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors font-semibold text-[0.95rem] text-foreground cursor-pointer"
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
}

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

function SignupForm({ compact = false }: { compact?: boolean }) {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const signup = useSignup();

  const gap = compact ? "gap-3.5" : "gap-4";

  return (
    <form
      className={`flex flex-col ${gap}`}
      onSubmit={(e) => {
        e.preventDefault();
        signup.mutate(form);
      }}
    >
      <GoogleButton />

      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="flex-1 h-px bg-border" />
        <span className="text-xs font-mono tracking-wider uppercase">or</span>
        <span className="flex-1 h-px bg-border" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name" className="text-[0.84rem] font-semibold">Full name</Label>
        <Input id="name" placeholder="Tinashe Moyo" value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-[0.84rem] font-semibold">Email</Label>
        <Input id="email" type="email" placeholder="you@email.com" value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username" className="text-[0.84rem] font-semibold">Username</Label>
        {!compact && <span className="text-xs text-muted-foreground -mt-0.5">This is your public portfolio handle.</span>}
        <div className="relative flex items-center">
          <span className="absolute left-3 text-muted-foreground font-mono text-[0.92rem] pointer-events-none">@</span>
          <Input id="username" placeholder="tinashe" className="pl-7" value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password" className="text-[0.84rem] font-semibold">Password</Label>
        <div className="relative flex items-center">
          <Input id="password" type={showPw ? "text" : "password"} placeholder="Create a password"
            className="pr-10" value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required minLength={8} />
          <button type="button" onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPw ? "Hide password" : "Show password"}>
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {signup.isError && (
        <p className="text-sm text-destructive">
          {(signup.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Something went wrong."}
        </p>
      )}

      <Button type="submit" disabled={signup.isPending}
        className="h-12 text-base font-semibold bg-[var(--zd-gold)] hover:bg-[var(--zd-gold-hover)] text-[var(--zd-gold-fg)] rounded-xl mt-1 flex flex-row-reverse items-center gap-2">
        <ArrowRight size={18} />
        {signup.isPending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        By continuing you agree to our{" "}
        <Link href="/terms" className="font-semibold underline decoration-[var(--zd-gold)] underline-offset-2">Terms</Link>
        {" "}&amp;{" "}
        <Link href="/privacy" className="font-semibold underline decoration-[var(--zd-gold)] underline-offset-2">Privacy Policy</Link>.
      </p>
    </form>
  );
}

export default function SignupPage() {
  return (
    <>
      {/* ── Desktop: side-by-side ── */}
      <div className="hidden md:grid md:grid-cols-[1.05fr_1fr] min-h-svh">
        {/* Mission panel */}
        <div className="relative bg-[var(--zd-bg-alt)] border-r border-border p-12 flex flex-col overflow-hidden">
          {/* Dot texture */}
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(oklch(0.905 0.006 90) 1.2px, transparent 1.2px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative flex flex-col h-full">
            <Wordmark size={24} />
            <div className="mt-auto max-w-[460px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--zd-green)] bg-[var(--zd-green-tint)] text-[var(--zd-green)] text-[11.2px] font-normal tracking-[0.06em] uppercase" style={{ paddingTop: "5px", paddingBottom: "5px", paddingLeft: "11px", paddingRight: "11px" }}>
                <Flag size={10} /> The redesign movement
              </span>
              <h1 className="mt-5 text-[2.65rem] font-bold leading-[1.08] tracking-tight text-foreground"
                style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
                Redesign Zimbabwe's apps.
              </h1>
              <p className="mt-4 text-[1.08rem] text-muted-foreground leading-[1.55] max-w-[400px]">{MISSION}</p>
            </div>
            {/* Abstract app cards */}
            <div className="relative mt-10 h-[210px]">
              <div className="absolute left-0 top-5 w-[150px] h-[188px]">
                <AppCard accent="gold" rotate={-5} />
              </div>
              <div className="absolute left-[132px] top-0 w-[158px] h-[200px] z-10">
                <AppCard accent="green" rotate={3} />
              </div>
              <div className="absolute left-[286px] top-8 w-[146px] h-[176px]">
                <AppCard accent="gold" rotate={-2} />
              </div>
            </div>
            <div className="mt-auto pt-8 flex items-center gap-4">
              <FlagBar width={64} height={5} />
              <span className="text-xs font-mono tracking-wider text-muted-foreground uppercase">
                Portfolios are a byproduct. The mission is collective.
              </span>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center px-14 py-12 overflow-y-auto">
          <div className="w-full max-w-[380px] mx-auto">
            <h2 className="text-[1.85rem] font-extrabold tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
              Join the movement
            </h2>
            <p className="mt-1.5 mb-7 text-[0.98rem] text-muted-foreground">
              Create your account to start improving the apps Zimbabwe uses daily.
            </p>
            <SignupForm />
            <p className="text-center mt-5 text-[0.92rem] text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold underline decoration-[var(--zd-gold)] underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile: stacked ── */}
      <div className="md:hidden min-h-svh px-6 pt-6 pb-5 flex flex-col bg-background">
        <div className="flex items-center justify-between">
          <Wordmark size={19} />
          <FlagBar width={40} height={4} />
        </div>
        <div className="mt-6">
          <h1 className="text-[1.65rem] font-bold tracking-tight leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
            Redesign Zimbabwe's apps.
          </h1>
          <p className="mt-2 text-[0.93rem] text-muted-foreground leading-relaxed">
            Zimbabwe has talented designers &amp; developers. Let&apos;s fix the apps we use every day.
          </p>
        </div>
        <div className="mt-6 flex-1">
          <SignupForm compact />
        </div>
        <p className="text-center mt-4 text-[0.9rem] text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold underline decoration-[var(--zd-gold)] underline-offset-2">Sign in</Link>
        </p>
      </div>
    </>
  );
}
