"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/button";
import { useAdminApps, useCreateAdminApp } from "@/hooks/use-admin";
import type { AdminApp } from "@/hooks/use-admin";

const COLORS = ["#E8A900", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F59E0B", "#EC4899", "#14B8A6"];

function AppRow({ app }: { app: AdminApp }) {
  const tags: string[] = (() => { try { return JSON.parse(app.tags); } catch { return []; } })();
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-border last:border-0">
      <div
        className="w-9 h-9 rounded-xl flex-none flex items-center justify-center font-bold text-white text-sm"
        style={{ background: app.iconColor }}
      >
        {app.iconLetter}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground">{app.name}</p>
        <p className="text-xs text-muted-foreground truncate">/{app.slug}</p>
      </div>
      {tags.length > 0 && (
        <div className="hidden sm:flex items-center gap-1 flex-wrap">
          {tags.slice(0, 3).map((t) => (
            <span key={t} className="text-[0.6rem] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wide">
              {t}
            </span>
          ))}
        </div>
      )}
      <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${app.isPublished ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
        {app.isPublished ? "Live" : "Draft"}
      </span>
    </div>
  );
}

function CreateAppModal({ onClose }: { onClose: () => void }) {
  const create = useCreateAdminApp();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    iconColor: COLORS[0],
    tagsRaw: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(form.slug)) e.slug = "Lowercase letters, numbers and hyphens only";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    const tags = form.tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
    await create.mutateAsync({ name: form.name, slug: form.slug, description: form.description || undefined, iconColor: form.iconColor, tags });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>
            Add an app
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">App name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) }))}
              placeholder="e.g. EcoCash"
              className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all"
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="e.g. ecocash"
              className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all font-mono"
            />
            {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Description <span className="normal-case font-normal">(optional)</span></label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What does this app do?"
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Tags <span className="normal-case font-normal">(comma separated)</span></label>
            <input
              value={form.tagsRaw}
              onChange={(e) => setForm((f) => ({ ...f, tagsRaw: e.target.value }))}
              placeholder="e.g. fintech, payments"
              className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all"
            />
          </div>

          {/* Icon colour */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Icon colour</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, iconColor: c }))}
                  className={`w-7 h-7 rounded-lg border-2 transition-all ${form.iconColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          {create.isError && (
            <p className="text-sm text-destructive">{(create.error as Error).message}</p>
          )}

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending} className="flex-1 rounded-xl gap-1.5">
              <Plus size={14} /> {create.isPending ? "Creating…" : "Create app"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminAppsPage() {
  const { data: apps, isLoading } = useAdminApps();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl">
      {showCreate && <CreateAppModal onClose={() => setShowCreate(false)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-extrabold text-foreground"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}
          >
            Original apps
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Apps the community can redesign.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-xl">
          <Plus size={15} strokeWidth={2.5} /> Add an app
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card px-5">
        {isLoading && (
          <div className="space-y-3 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        )}
        {!isLoading && (!apps || apps.length === 0) && (
          <div className="text-center py-16">
            <p className="font-semibold text-foreground mb-1">No apps yet</p>
            <p className="text-sm text-muted-foreground">Add the first app to get started.</p>
          </div>
        )}
        {apps && apps.length > 0 && apps.map((app) => (
          <AppRow key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
