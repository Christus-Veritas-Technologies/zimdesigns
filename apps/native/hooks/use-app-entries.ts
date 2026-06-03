import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

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

export function useAppEntries() {
  return useQuery<AppEntrySummary[]>({
    queryKey: ["app-entries"],
    queryFn: () => api.get<AppEntrySummary[]>("/api/apps").then((r) => r.data),
  });
}
