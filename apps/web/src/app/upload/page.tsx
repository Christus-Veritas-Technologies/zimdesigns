"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Check, ArrowLeft, ImageIcon, Figma, Github, Link2, ChevronDown, ArrowUp, MessageCircle, Bookmark } from "lucide-react";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useCreateRedesign } from "@/hooks/use-redesigns";
import { useAppEntries } from "@/hooks/use-app-entries";

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
  const [appDropdownOpen, setAppDropdownOpen] = useState(false);

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

    create.mutate(fd, { onSuccess: (r) => router.push(`/redesigns/${r.id}`) });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors">
            <ArrowLeft size={16} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
              Submit a Redesign
            </h1>
            <p className="text-sm text-muted-foreground">Show how you&apos;d improve a Zimbabwean app.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Left: form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
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

            {/* App + Title */}
            <section className="flex flex-col gap-4">
              <h2 className="font-bold text-foreground text-sm" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>Details</h2>

              {/* App selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">App <span className="text-destructive">*</span></label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAppDropdownOpen((o) => !o)}
                    className="w-full h-11 px-3.5 rounded-xl border border-input bg-card text-sm text-left flex items-center justify-between hover:border-primary/50 transition-colors"
                  >
                    <span className={appName ? "text-foreground" : "text-muted-foreground"}>{appName || "Select an app…"}</span>
                    <ChevronDown size={15} className="text-muted-foreground" />
                  </button>
                  {appDropdownOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border border-border bg-card shadow-lg overflow-hidden">
                      {apps?.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => { setAppName(a.name); setAppDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-none" style={{ backgroundColor: a.iconColor }}>{a.iconLetter}</div>
                          {a.name}
                        </button>
                      ))}
                      <div className="border-t border-border">
                        <button
                          type="button"
                          onClick={() => { setAppDropdownOpen(false); }}
                          className="w-full px-4 py-2.5 text-xs text-muted-foreground hover:bg-muted transition-colors text-left"
                        >
                          + My app isn&apos;t listed — type it below
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {!apps?.find((a) => a.name === appName) && appName && (
                  <p className="text-xs text-muted-foreground">This app isn&apos;t in the directory yet — it&apos;ll be added for review.</p>
                )}
                {!appDropdownOpen && !appName && (
                  <input
                    type="text"
                    placeholder="Or type app name…"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="h-9 px-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                )}
              </div>

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
                  className="h-11 px-3.5 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                  className="px-3.5 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
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
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors",
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
                      className="flex-1 h-9 px-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                  className="flex-1 h-11 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
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
