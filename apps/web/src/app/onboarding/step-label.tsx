"use client";

import { usePathname } from "next/navigation";

const STEP_MAP: Record<string, { num: number; label: string }> = {
  "/onboarding/step1": { num: 1, label: "Profile" },
  "/onboarding/step2": { num: 2, label: "Interests" },
  "/onboarding/step3": { num: 3, label: "All set" },
};

export function StepLabel() {
  const pathname = usePathname();
  const step = STEP_MAP[pathname];
  if (!step) return null;
  return (
    <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-muted-foreground">
      Step {step.num} of 3 · {step.label}
    </span>
  );
}
