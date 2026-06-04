"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Camera, Linkedin, Github, Globe,
  Twitter, Dribbble, Save,
} from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { Input } from "@zimdesigns/ui/components/ui/input";
import { Textarea } from "@zimdesigns/ui/components/ui/textarea";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useMe, useUpdateProfile } from "@/hooks/use-onboarding";

const ROLES = [
  { id: "designer", label: "Designer" },
  { id: "developer", label: "Developer" },
  { id: "both", label: "Both" },
] as const;

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { data: me, isLoading } = useMe();
  const update = useUpdateProfile();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<"designer" | "developer" | "both">("designer");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [dribbble, setDribbble] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [initialised, setInitialised] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (me && !initialised) {
    setName(me.name ?? "");
    setUsername(me.username ?? "");
    setBio(me.bio ?? "");
    setRole((me.role as typeof role) ?? "designer");
    setLinkedin(me.linkedinUrl ?? "");
    setGithub(me.githubUrl ?? "");
    setDribbble(me.dribbbleUrl ?? "");
    setTwitter(me.twitterUrl ?? "");
    setWebsite(me.websiteUrl ?? "");
    setInitialised(true);
  }

  const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", name);
    fd.append("username", username);
    fd.append("bio", bio);
    fd.append("role", role);
    fd.append("linkedinUrl", linkedin);
    fd.append("githubUrl", github);
    fd.append("dribbbleUrl", dribbble);
    fd.append("twitterUrl", twitter);
    fd.append("websiteUrl", website);
    if (avatarFile) fd.append("avatar", avatarFile);
    update.mutate(fd, { onSuccess: () => router.back() });
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-6 bg-muted rounded w-32" />
        <div className="h-20 w-20 bg-muted rounded-2xl" />
        <div className="h-10 bg-muted rounded-xl" />
        <div className="h-10 bg-muted rounded-xl" />
      </div>
    );
  }

  const currentAvatar = avatarPreview ?? (me?.avatarUrl ? absoluteUrl(me.avatarUrl) : null);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft size={16} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-foreground tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
              Edit Profile
            </h1>
            <p className="text-xs text-muted-foreground">Update your info and social links.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div
              onClick={() => fileRef.current?.click()}
              className="relative w-24 h-24 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center cursor-pointer group border-2 border-dashed border-border hover:border-primary transition-colors"
            >
              {currentAvatar ? (
                <Image src={currentAvatar} alt="Avatar" fill className="object-cover" unoptimized />
              ) : (
                <span className="text-2xl font-extrabold text-primary">{(me?.name ?? "?").charAt(0).toUpperCase()}</span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">PNG or JPG · max 5 MB</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
          </div>

          {/* Basic info */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Full name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} className="rounded-xl" disabled={update.isPending} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-muted-foreground text-sm">@</span>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} maxLength={30} className="rounded-xl pl-8" disabled={update.isPending} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Bio</label>
              <span className="text-xs font-mono text-muted-foreground">{bio.length}/160</span>
            </div>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={160} rows={3} className="rounded-xl resize-none" disabled={update.isPending} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">I am a…</label>
            <div className="flex gap-2">
              {ROLES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors",
                    role === id ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-3 border-t border-border pt-5">
            <p className="text-sm font-semibold text-foreground">Social links</p>

            {[
              { icon: Linkedin, label: "LinkedIn", placeholder: "https://linkedin.com/in/yourname", value: linkedin, set: setLinkedin, color: "#0A66C2" },
              { icon: Github, label: "GitHub", placeholder: "https://github.com/yourname", value: github, set: setGithub, color: "#24292f" },
              { icon: Dribbble, label: "Dribbble", placeholder: "https://dribbble.com/yourname", value: dribbble, set: setDribbble, color: "#EA4C89" },
              { icon: Twitter, label: "X (Twitter)", placeholder: "https://x.com/yourname", value: twitter, set: setTwitter, color: "#000000" },
              { icon: Globe, label: "Website", placeholder: "https://yoursite.com", value: website, set: setWebsite, color: "#8A8278" },
            ].map(({ icon: Icon, label, placeholder, value, set, color }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center flex-none">
                  <Icon size={16} style={{ color }} />
                </div>
                <Input
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  type="url"
                  className="rounded-xl flex-1"
                  disabled={update.isPending}
                />
              </div>
            ))}
          </div>

          {update.isError && (
            <p className="text-destructive text-sm">
              {(update.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save."}
            </p>
          )}

          <Button
            type="submit"
            disabled={update.isPending}
            className="h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold"
          >
            <Save size={16} />
            {update.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
