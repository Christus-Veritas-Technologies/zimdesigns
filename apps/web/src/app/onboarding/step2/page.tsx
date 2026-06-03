"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/button";
import { cn } from "@zimdesigns/ui/lib/utils";
import { StepsBar } from "@/components/onboarding/steps-bar";
import { useUpdateInterests } from "@/hooks/use-onboarding";
import { useRouter } from "next/navigation";

const INTERESTS = [
  "Mobile Apps",
  "Web Apps",
  "Local Apps",
  "Banking",
  "E-commerce",
  "Social Media",
  "Other",
];

export default function Step2Page() {
  const [selected, setSelected] = useState<string[]>(["Local Apps", "Banking"]);
  const updateInterests = useUpdateInterests();
  const router = useRouter();

  const toggle = (item: string) =>
    setSelected((s) => (s.includes(item) ? s.filter((x) => x !== item) : [...s, item]));

  const handleContinue = () =>
    updateInterests.mutate(selected, {
      onSuccess: () => router.push("/onboarding/step3"),
    });

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-[540px] bg-card border border-border rounded-2xl shadow-md p-8">
        {/* Progress */}
        <div className="mb-6">
          <StepsBar current={2} />
        </div>

        <h1
          className="text-[1.7rem] font-bold tracking-tight leading-tight mb-1"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
        >
          What Apps Should We Focus On?
        </h1>
        <p className="text-[0.98rem] text-muted-foreground mb-6">
          Help us understand what needs improving.
        </p>

        {/* Chips */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          {INTERESTS.map((item) => {
            const on = selected.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggle(item)}
                className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border font-medium text-[0.92rem] cursor-pointer transition-all",
                  on
                    ? "border-[var(--zd-gold)] bg-[var(--zd-gold-tint)] text-foreground"
                    : "border-border bg-card hover:border-muted-foreground text-foreground",
                )}
              >
                <span
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center flex-none border transition-all",
                    on
                      ? "bg-[var(--zd-gold)] border-[var(--zd-gold)]"
                      : "border-border",
                  )}
                >
                  {on && <Check size={10} strokeWidth={3} className="text-[var(--zd-gold-fg)]" />}
                </span>
                {item}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-8">
          <Check size={12} className="text-[var(--zd-green)]" />
          Pick as many as you like — you can change this later.
        </p>

        {/* Footer */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" type="button"
            className="text-muted-foreground"
            onClick={handleContinue}>
            Skip for now
          </Button>
          <div className="flex-1" />
          <Button variant="outline" type="button" onClick={() => router.push("/onboarding/step1")}
            className="rounded-xl">
            Back
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            disabled={updateInterests.isPending}
            className="h-11 font-semibold bg-[var(--zd-gold)] hover:bg-[var(--zd-gold-hover)] text-[var(--zd-gold-fg)] rounded-xl flex flex-row-reverse items-center gap-2"
          >
            <ArrowRight size={16} />
            {updateInterests.isPending ? "Saving…" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
