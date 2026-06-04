"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Redesign } from "./use-redesigns";

export interface AppEntrySummary {
  id: string;
  slug: string;
  name: string;
  iconColor: string;
  iconLetter: string;
  description: string | null;
  tags: string[];
  screenshotUrl: string | null;
}

export interface AppEntryDetail extends AppEntrySummary {
  brokenItems: string[];
  stats: {
    redesignCount: number;
    totalVotes: number;
    designerCount: number;
  };
  redesigns: Redesign[];
}

export function useAppEntry(slug: string) {
  return useQuery<AppEntryDetail>({
    queryKey: ["app-entry", slug],
    queryFn: () => api.get<AppEntryDetail>(`/api/apps/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });
}

export function useAppEntries() {
  return useQuery<AppEntrySummary[]>({
    queryKey: ["app-entries"],
    queryFn: () => api.get<AppEntrySummary[]>("/api/apps").then((r) => r.data),
  });
}
