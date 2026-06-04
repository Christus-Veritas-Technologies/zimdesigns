"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Camera, Upload } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/button";
import { Input } from "@zimdesigns/ui/components/input";
import { Label } from "@zimdesigns/ui/components/label";
import { StepsBar } from "@/components/onboarding/steps-bar";
import { useMe, useUpdateProfile } from "@/hooks/use-onboarding";
import { useRouter } from "next/navigation";

type Role = "designer" | "developer" | "both";

const ROLES: { id: Role; label: string; icon: React.ReactNode }[] = [
  { id: "designer", label: "Designer", icon: <BrushIcon /> },
  { id: "developer", label: "Developer", icon: <CodeIcon /> },
  { id: "both", label: "Both", icon: <BothIcon /> },
];

export default function Step1Page() {
  const { data: me } = useMe();
  const updateProfile = useUpdateProfile();
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: me?.name ?? "",
    username: me?.username ?? "",
    bio: me?.bio ?? "",
    role: (me?.role ?? "designer") as Role,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(me?.avatarUrl ?? null);

  const bioLen = form.bio.length;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { alert("Avatar must be under 5 MB."); return; }
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("username", form.username);
    if (form.bio) fd.append("bio", form.bio);
    fd.append("role", form.role);
    if (avatarFile) fd.append("avatar", avatarFile);
    updateProfile.mutate(fd, {
      onSuccess: () => router.push("/onboarding/step2"),
    });
  };

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-[540px] bg-card border border-border rounded-2xl shadow-md p-8">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          <StepsBar current={1} className="flex-1" />
          <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase whitespace-nowrap">
            Step 1 of 3
          </span>
        </div>

        <h1
          className="text-[1.7rem] font-extrabold tracking-tight leading-tight mb-1"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
        >
          Let&apos;s Get You Started
        </h1>
        <p className="text-[0.98rem] text-muted-foreground mb-6">
          Complete your profile. Everything below is ready to go.
        </p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="w-[72px] h-[72px] rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center text-muted-foreground flex-none overflow-hidden hover:border-primary/50 transition-colors relative"
            >
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Avatar" fill className="object-cover" unoptimized />
              ) : (
                <Camera size={22} />
              )}
            </button>
            <div>
              <Button type="button" variant="outline"
                onClick={() => avatarInputRef.current?.click()}
                className="h-9 text-sm rounded-xl gap-2 border-border">
                <Upload size={15} /> {avatarPreview ? "Change photo" : "Upload photo"}
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">PNG or JPG, max 5 MB. Optional.</p>
              <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[0.84rem] font-semibold">Full name</Label>
            <Input placeholder="Tinashe Moyo" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required
              disabled={updateProfile.isPending} />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[0.84rem] font-semibold">Username</Label>
            <span className="text-xs text-muted-foreground -mt-0.5">Pre-filled from signup — edit if you like.</span>
            <div className="relative flex items-center">
              <span className="absolute left-3 font-mono text-[0.92rem] text-muted-foreground pointer-events-none">@</span>
              <Input placeholder="tinashe" className="pl-7" value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} required
                disabled={updateProfile.isPending} />
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-[0.84rem] font-semibold">Bio</Label>
              <span className="text-xs font-mono text-muted-foreground">{bioLen}/160</span>
            </div>
            <textarea
              rows={3}
              maxLength={160}
              placeholder="Designer focused on fixing everyday Zimbabwean apps."
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              disabled={updateProfile.isPending}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--zd-ring)] focus:border-[var(--zd-gold)] transition-colors disabled:opacity-60"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-2">
            <Label className="text-[0.84rem] font-semibold">I am a…</Label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(({ id, label, icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: id }))}
                  className={`flex flex-col items-center gap-2 py-3.5 px-2 rounded-xl border transition-all text-sm font-semibold ${
                    form.role === id
                      ? "border-[var(--zd-gold)] bg-[var(--zd-gold-tint)] shadow-[inset_0_0_0_1px_var(--zd-gold)]"
                      : "border-border bg-card hover:border-muted-foreground"
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    form.role === id ? "bg-[var(--zd-gold)] text-[var(--zd-gold-fg)]" : "bg-muted text-muted-foreground"
                  }`}>
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {updateProfile.isError && (
            <p className="text-sm text-destructive">
              {(updateProfile.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save profile."}
            </p>
          )}

          <div className="flex items-center gap-3 mt-1">
            <Button
              type="button"
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => router.push("/onboarding/step2")}
            >
              Skip for now
            </Button>
            <div className="flex-1" />
            <Button
              type="submit"
              disabled={updateProfile.isPending}
              className="h-12 text-base font-semibold bg-[var(--zd-gold)] hover:bg-[var(--zd-gold-hover)] text-[var(--zd-gold-fg)] rounded-xl flex flex-row-reverse items-center gap-2"
            >
              <ArrowRight size={18} />
              {updateProfile.isPending ? "Saving…" : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BrushIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3l7 7-8 2-4 4M9.5 16a3.5 3.5 0 1 1-3.5-3.5"/></svg>;
}
function CodeIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/></svg>;
}
function BothIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M8 7l-4 5 4 5M16 7l4 5-4 5"/></svg>;
}
