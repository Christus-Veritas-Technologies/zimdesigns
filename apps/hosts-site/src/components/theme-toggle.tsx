"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun03Icon, Moon02Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("size-9", className)} aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "size-9 rounded-lg flex items-center justify-center",
        "text-muted hover:text-foreground hover:bg-subtle",
        "transition-colors cursor-pointer",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <HugeiconsIcon
        icon={isDark ? Sun03Icon : Moon02Icon}
        size={20}
        strokeWidth={1.5}
        primaryColor="currentColor"
      />
    </button>
  );
}
