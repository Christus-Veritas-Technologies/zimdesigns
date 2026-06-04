"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface Collection {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  isFeatured: boolean;
  redesignCount: number;
  curator: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
  };
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  gradientFrom: string;
  gradientTo: string;
  appName: string | null;
}

export function useCollections() {
  return useQuery<Collection[]>({
    queryKey: ["collections"],
    queryFn: () => api.get<Collection[]>("/api/discover/collections").then((r) => r.data),
  });
}

export function useChallenges() {
  return useQuery<Challenge[]>({
    queryKey: ["challenges"],
    queryFn: () => api.get<Challenge[]>("/api/discover/challenges").then((r) => r.data),
  });
}

export interface CollectionRedesign {
  id: string;
  title: string;
  appName: string;
  beforeUrl: string;
  afterUrl: string;
  upvoteCount: number;
  tags: string[];
  author: { id: string; name: string; username: string; avatarUrl: string | null; role: string | null };
}

export interface CollectionDetail extends Omit<Collection, "redesignCount"> {
  redesigns: CollectionRedesign[];
}

export function useCollection(id: string) {
  return useQuery<CollectionDetail>({
    queryKey: ["collection", id],
    queryFn: () => api.get<CollectionDetail>(`/api/discover/collections/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}
