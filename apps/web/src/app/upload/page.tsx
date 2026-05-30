"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Check, ArrowLeft, ImageIcon } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { Input } from "@zimdesigns/ui/components/ui/input";
import { Textarea } from "@zimdesigns/ui/components/ui/textarea";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useCreateRedesign } from "@/hooks/use-redesigns";

const TAG_OPTIONS = [
  "Mobile Apps", "Web Apps", "Banking", "E-commerce",
  "Social Media", "Fintech", "Government", "Health", "Other",
];

function ImageDropzone({
  label,
  file,
  onFile,
}: {
  label: string;
  file: File | null;
  onFile: (f: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files[0];
          if (f?.type.startsWith("image/")) onFile(f);
        }}
        className={cn(
          "relative cursor-pointer rounded-xl border-2 border-dashed transition-colors overflow-hidden",
          "aspect-[4/3] flex flex-col items-center justify-center gap-2",
          drag ? "border-primary bg-primary/5" : "border-border bg-muted/40 hover:border-primary/50",
          preview && "border-solid border-border",
        )}
      >
        {preview ? (
          <Image src={preview} alt={label} fill className="object-cover" unoptimized />
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <ImageIcon size={20} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground text-center px-4">
              Drop an image or <span className="text-primary font-medium">browse</span>
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WebP</p>
          </>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
      </div>
    </div>
  );
}

export default function UploadPage() {
  const router = useRouter();
  const create = useCreateRedesign();

  const [title, setTitle] = useState("");
  const [appName, setAppName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);

  const toggleTag = (t: string) =>
    setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const valid = title.trim() && appName.trim() && beforeFile && afterFile;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("appName", appName.trim());
    if (description.trim()) fd.append("description", description.trim());
    fd.append("tags", JSON.stringify(tags));
    fd.append("before", beforeFile!);
    fd.append("after", afterFile!);

    create.mutate(fd, {
      onSuccess: (r) => router.push(`/redesigns/${r.id}`),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft size={16} className="text-muted-foreground" />
          </button>
          <div>
            <h1
              className="text-2xl font-extrabold text-foreground tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
              Upload a Redesign
            </h1>
            <p className="text-sm text-muted-foreground">Show how you&apos;d improve a Zimbabwean app.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            <ImageDropzone label="Before" file={beforeFile} onFile={setBeforeFile} />
            <ImageDropzone label="After" file={afterFile} onFile={setAfterFile} />
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">Title</label>
              <Input
                placeholder="EcoCash redesign — cleaner checkout flow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                className="rounded-xl border-input bg-card"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">App name</label>
              <Input
                placeholder="EcoCash"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                maxLength={60}
                className="rounded-xl border-input bg-card"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Description</label>
                <span className="text-xs font-mono text-muted-foreground">{description.length}/500</span>
              </div>
              <Textarea
                placeholder="What problem does your redesign solve? What changed and why?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={4}
                className="rounded-xl border-input bg-card resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">Tags</label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((t) => {
                  const on = tags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors",
                        on
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground hover:border-primary/50",
                      )}
                    >
                      {on && <Check size={11} strokeWidth={3} className="text-primary" />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {create.isError && (
            <p className="text-destructive text-sm">
              {(create.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Failed to upload. Please try again."}
            </p>
          )}

          <Button
            type="submit"
            disabled={!valid || create.isPending}
            className="h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold text-base"
          >
            <Upload size={17} />
            {create.isPending ? "Uploading…" : "Publish Redesign"}
          </Button>
        </form>
      </div>
    </div>
  );
}
