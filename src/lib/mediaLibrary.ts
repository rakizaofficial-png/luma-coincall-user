/**
 * Public media library client — approved/enabled admin videos.
 */

import { requireApiBase } from "@/config/apiConfig";

export type PublicLibraryVideo = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  language: string;
  durationSec: number;
  thumbnailUrl: string;
  previewFrameUrl: string;
  streamUrl: string;
  variants: {
    label: string;
    url: string;
    height?: number;
    sizeBytes: number;
  }[];
  sortOrder: number;
  viewCount: number;
};

export async function fetchPublicLibraryVideos(opts?: {
  category?: string;
  q?: string;
}): Promise<PublicLibraryVideo[]> {
  const base = requireApiBase();
  const params = new URLSearchParams();
  if (opts?.category) params.set("category", opts.category);
  if (opts?.q) params.set("q", opts.q);
  const qs = params.toString() ? `?${params}` : "";
  const res = await fetch(`${base}/media/videos${qs}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { videos?: PublicLibraryVideo[] };
  return data.videos || [];
}

/** Prefer 720p / 480p for bandwidth, else streamUrl */
export function pickStreamUrl(v: PublicLibraryVideo): string {
  const prefer =
    v.variants.find((x) => x.label === "720p") ||
    v.variants.find((x) => x.label === "480p") ||
    v.variants.find((x) => x.label === "360p");
  return prefer?.url || v.streamUrl;
}
