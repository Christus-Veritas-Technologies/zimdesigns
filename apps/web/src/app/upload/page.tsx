"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Check, ArrowLeft, ImageIcon, Figma, Github, Link2, ArrowUp, MessageCircle, Bookmark, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useCreateRedesign } from "@/hooks/use-redesigns";
import { useAppEntries } from "@/hooks/use-app-entries";

const DRAFT_KEY = "zd_upload_draft";

interface DraftData {
  title: string;
  appName: string;
  description: string;
  categories: string[];
  figmaUrl: string;
  githubUrl: string;
  prototypeUrl: string;
  savedAt: number;
}

function saveDraft(data: DraftData) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch {}
}

function loadDraft(): DraftData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as DraftData) : null;
  } catch { return null; }
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
}

const CATEGORIES = ["Banking", "Mobile", "Web", "Local", "E-commerce", "Social"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SCREENSHOTS = 5;

const CHECKLIST = [
  "Clearly shows what problem you're solving",
  "Includes both before and after screenshots",
  "Design is original and not copied",
  "Screenshots are high quality (min 750px wide)",
  "Title accurately describes your redesign",
];

function validateImage(f: File): string | null {
  if (!ALLOWED_TYPES.includes(f.type)) return "Only JPG, PNG, or WebP allowed.";
  if (f.size > MAX_FILE_SIZE) return `Too large (max 5 MB). Yours is ${(f.size / 1024 / 1024).toFixed(1)} MB.`;
  return null;
}

function ScreenshotSlot({
  index,
  label,
  file,
  onFile,
  onRemove,
  required,
}: {
  index: number;
  label: string;
  file: File | null;
  onFile: (f: File) => void;
  onRemove: () => void;
  required?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const preview = file ? URL.createObjectURL(file) : null;

  const handleFile = (f: File) => {
    const err = validateImage(f);
    if (err) { setError(err); return; }
    setError(null);
    onFile(f);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-[var(--zd-gold)] text-[0.65rem] font-bold text-[var(--zd-gold-fg)] flex items-center justify-center flex-none">{index + 1}</span>
        <span className="text-xs font-semibold text-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</span>
        {file && (
          <button type="button" onClick={onRemove} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
            <X size={13} />
          </button>
        )}
      </div>
      <div
        onClick={() => !file && ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!file) setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault(); setDrag(false);
          const f = e.dataTransfer.files[0];
          if (f && !file) handleFile(f);
        }}
        className={cn(
          "relative rounded-xl border-2 overflow-hidden transition-colors",
          "aspect-[4/3] flex flex-col items-center justify-center gap-1.5",
          file ? "border-solid border-border cursor-default" :
            error ? "border-destructive bg-destructive/5 cursor-pointer" :
              drag ? "border-primary bg-primary/5 cursor-pointer" :
                "border-dashed border-border bg-muted/30 hover:border-primary/50 cursor-pointer",
        )}
      >
        {preview ? (
          <Image src={preview} alt={label} fill className="object-cover" unoptimized />
        ) : (
          <>
            <ImageIcon size={18} className={error ? "text-destructive" : "text-muted-foreground"} />
            <p className="text-[0.65rem] text-muted-foreground text-center px-2">Drop or <span className="text-primary">browse</span></p>
          </>
        )}
        <input ref={ref} type="file" accept={ALLOWED_TYPES.join(",")} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
      {error && <p className="text-[0.65rem] text-destructive leading-tight">{error}</p>}
    </div>
  );
}

function PreviewCard({ title, appName, afterFile }: { title: string; appName: string; afterFile: File | null }) {
  const preview = afterFile ? URL.createObjectURL(afterFile) : null;
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted">
        {preview ? (
          <Image src={preview} alt="preview" fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon size={32} className="text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] uppercase">Redesign</span>
          {appName && <span className="text-[0.6rem] font-semibold px-2 py-0.5 rounded-full bg-black/50 text-white">{appName}</span>}
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2 min-h-[2.5rem]">
          {title || <span className="text-muted-foreground/50">Your redesign title…</span>}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-[0.55rem] font-bold text-primary">Y</span>
            </div>
            <span className="text-xs text-muted-foreground">You</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><MessageCircle size={10} />0</span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-xs text-muted-foreground"><ArrowUp size={10} />0</span>
            <span className="w-6 h-6 rounded-full border border-border flex items-center justify-center"><Bookmark size={10} className="text-muted-foreground" /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  const router = useRouter();
  const create = useCreateRedesign();
  const { data: apps } = useAppEntries();

  const [title, setTitle] = useState("");
  const [appName, setAppName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [figmaUrl, setFigmaUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [prototypeUrl, setPrototypeUrl] = useState("");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [screenshots, setScreenshots] = useState<(File | null)[]>([null, null, null]);
  const [hasDraft, setHasDraft] = useState(false);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setTitle(draft.title);
      setAppName(draft.appName);
      setDescription(draft.description);
      setCategories(draft.categories);
      setFigmaUrl(draft.figmaUrl);
      setGithubUrl(draft.githubUrl);
      setPrototypeUrl(draft.prototypeUrl);
      setHasDraft(true);
    }
  }, []);

  const draftData = useCallback((): DraftData => ({
    title, appName, description, categories, figmaUrl, githubUrl, prototypeUrl, savedAt: Date.now(),
  }), [title, appName, description, categories, figmaUrl, githubUrl, prototypeUrl]);

  // Auto-save text fields after 1.5s of inactivity
  useEffect(() => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      const data = draftData();
      if (data.title || data.appName || data.description) {
        saveDraft(data);
        setHasDraft(true);
      }
    }, 1500);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [draftData]);

  function handleSaveDraft() {
    saveDraft(draftData());
    setHasDraft(true);
    toast.success("Draft saved", { description: "Your progress has been saved locally." });
  }

  const toggleCategory = (c: string) =>
    setCategories((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  const setScreenshot = (i: number, f: File | null) =>
    setScreenshots((prev) => { const next = [...prev]; next[i] = f; return next; });

  const valid = title.trim() && appName.trim() && beforeFile && afterFile;
  const checklist = [
    !!description.trim(),
    !!(beforeFile && afterFile),
    true,
    !!(afterFile && afterFile.size > 0),
    !!title.trim(),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("appName", appName.trim());
    if (description.trim()) fd.append("description", description.trim());
    fd.append("tags", JSON.stringify(categories));
    fd.append("before", beforeFile!);
    fd.append("after", afterFile!);
    for (const s of screenshots) { if (s) fd.append("screenshots", s); }
    if (figmaUrl.trim()) fd.append("figmaUrl", figmaUrl.trim());
    if (githubUrl.trim()) fd.append("githubUrl", githubUrl.trim());
    if (prototypeUrl.trim()) fd.append("prototypeUrl", prototypeUrl.trim());

    create.mutate(fd, {
      onSuccess: (r) => {
        clearDraft();
        router.push(`/redesigns/${r.id}`);
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors">
            <ArrowLeft size={16} className="text-muted-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
              Submit a Redesign
            </h1>
            <p className="text-sm text-muted-foreground">Show how you&apos;d improve a Zimbabwean app.</p>
          </div>
        </div>

        {/* Draft restored banner */}
        {hasDraft && (
          <div className="mb-6 flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[var(--zd-gold)]/40 bg-[var(--zd-gold)]/5 text-sm">
            <span className="text-foreground font-medium">Draft restored — your previous progress is loaded.</span>
            <button
              onClick={() => { clearDraft(); setTitle(""); setAppName(""); setDescription(""); setCategories([]); setFigmaUrl(""); setGithubUrl(""); setPrototypeUrl(""); setHasDraft(false); }}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 flex-none"
            >
              Discard
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Left: form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">

            {/* ── App selection ── MOVED TO TOP and made prominent */}
            <section className="flex flex-col gap-3">
              <div>
                <h2 className="font-bold text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
                  Which app are you redesigning? <span className="text-destructive">*</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Choose from the directory, or type a name if yours isn&apos;t listed.</p>
              </div>

              {apps && apps.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {apps.map((a) => {
                    const selected = appName === a.name;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAppName(selected ? "" : a.name)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all hover:scale-[1.03]",
                          selected
                            ? "border-primary bg-primary/5 shadow-sm scale-[1.03]"
                            : "border-border bg-card hover:border-primary/40",
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-none"
                          style={{ backgroundColor: a.iconColor }}
                        >
                          {a.iconLetter}
                        </div>
                        <span className={cn(
                          "text-[0.7rem] font-semibold leading-tight text-center line-clamp-2",
                          selected ? "text-primary" : "text-foreground",
                        )}>
                          {a.name}
                        </span>
                        {selected && <Check size={12} className="text-primary" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-wider">
                  {apps?.find((a) => a.name === appName) ? "Selected above" : "Or type manually"}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <input
                type="text"
                placeholder="App name (if not listed above)…"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {appName && !apps?.find((a) => a.name === appName) && (
                <p className="text-xs text-muted-foreground -mt-1">This app isn&apos;t in the directory yet — it&apos;ll be added for review.</p>
              )}
            </section>

            {/* Screenshots */}
            <section className="flex flex-col gap-4">
              <div>
                <h2 className="font-bold text-foreground text-sm" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>Screenshots</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Upload before + after. Add up to {MAX_SCREENSHOTS} shots total.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <ScreenshotSlot index={0} label="Before" file={beforeFile} onFile={setBeforeFile} onRemove={() => setBeforeFile(null)} required />
                <ScreenshotSlot index={1} label="After" file={afterFile} onFile={setAfterFile} onRemove={() => setAfterFile(null)} required />
                {screenshots.slice(0, 3).map((f, i) => (
                  <ScreenshotSlot key={i} index={i + 2} label={`Shot ${i + 3}`} file={f} onFile={(file) => setScreenshot(i, file)} onRemove={() => setScreenshot(i, null)} />
                ))}
              </div>
            </section>

            {/* Title + description */}
            <section className="flex flex-col gap-4">
              <h2 className="font-bold text-foreground text-sm" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>Details</h2>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Title <span className="text-destructive">*</span></label>
                  <span className={cn("text-xs font-mono", title.length > 100 ? "text-destructive" : "text-muted-foreground")}>{title.length}/120</span>
                </div>
                <input
                  type="text"
                  placeholder="EcoCash redesign — cleaner checkout flow"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                  disabled={create.isPending}
                  className="h-11 px-3.5 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">What problems does your design solve?</label>
                  <span className="text-xs font-mono text-muted-foreground">{description.length}/500</span>
                </div>
                <textarea
                  placeholder="Describe the UX issues you addressed and the design decisions you made…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={4}
                  disabled={create.isPending}
                  className="px-3.5 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-60"
                />
              </div>
            </section>

            {/* Categories */}
            <section className="flex flex-col gap-3">
              <h2 className="font-bold text-foreground text-sm" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>Category</h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const on = categories.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCategory(c)}
                      disabled={create.isPending}
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
                        on ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50",
                      )}
                    >
                      {on && <Check size={11} strokeWidth={3} />}{c}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Links */}
            <section className="flex flex-col gap-3">
              <div>
                <h2 className="font-bold text-foreground text-sm" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>Links <span className="text-muted-foreground font-normal">(optional)</span></h2>
                <p className="text-xs text-muted-foreground mt-0.5">Share your source files or prototype.</p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { icon: Figma, label: "Figma file", placeholder: "https://figma.com/file/…", value: figmaUrl, set: setFigmaUrl },
                  { icon: Github, label: "GitHub repository", placeholder: "https://github.com/…", value: githubUrl, set: setGithubUrl },
                  { icon: Link2, label: "Live prototype", placeholder: "https://…", value: prototypeUrl, set: setPrototypeUrl },
                ].map(({ icon: Icon, label, placeholder, value, set }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center flex-none">
                      <Icon size={15} className="text-muted-foreground" />
                    </div>
                    <input
                      type="url"
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      disabled={create.isPending}
                      className="flex-1 h-9 px-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                    />
                  </div>
                ))}
              </div>
            </section>

            {create.isError && (
              <p className="text-destructive text-sm">
                {(create.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to upload. Please try again."}
              </p>
            )}

            {/* Footer */}
            <div className="flex flex-col gap-3 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                By publishing you agree that this is original work and you have rights to share it. Redesigns that don&apos;t meet quality standards may be removed.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex-1 h-11 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={14} />
                  Save draft
                </button>
                <button
                  type="submit"
                  disabled={!valid || create.isPending}
                  className={cn(
                    "flex-1 h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors",
                    valid && !create.isPending
                      ? "bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] hover:bg-[var(--zd-gold-hover)]"
                      : "bg-muted text-muted-foreground cursor-not-allowed",
                  )}
                >
                  <Upload size={15} />
                  {create.isPending ? "Publishing…" : "Publish redesign"}
                </button>
              </div>
            </div>
          </form>

          {/* Right sidebar */}
          <aside className="flex flex-col gap-6">
            {/* Preview card */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-widest">Preview</span>
                <span className="text-[0.6rem] font-semibold px-2 py-0.5 rounded-full border border-border text-muted-foreground uppercase tracking-widest">Feed card</span>
              </div>
              <PreviewCard title={title} appName={appName} afterFile={afterFile} />
            </div>

            {/* Checklist */}
            <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
              <h3 className="font-bold text-foreground text-sm" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>Before you publish</h3>
              <ul className="flex flex-col gap-2.5">
                {CHECKLIST.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className={cn(
                      "w-4.5 h-4.5 rounded-full border flex items-center justify-center flex-none mt-0.5 transition-colors",
                      checklist[i] ? "bg-[var(--zd-gold)] border-[var(--zd-gold)]" : "border-border bg-muted",
                    )}>
                      {checklist[i] && <Check size={8} strokeWidth={3} className="text-[var(--zd-gold-fg)]" />}
                    </div>
                    <p className={cn("text-xs leading-relaxed", checklist[i] ? "text-foreground" : "text-muted-foreground")}>{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
