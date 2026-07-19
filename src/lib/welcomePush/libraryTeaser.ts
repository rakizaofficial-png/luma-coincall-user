/**
 * Prefer admin library teaser/welcome videos for welcome-push teasers.
 * Additive — falls back to existing CDN / demo URLs.
 */
import { FALLBACK_TEASER } from "./demoHosts";

let cachedLibraryTeaser: string | null | undefined;

export async function resolveLibraryTeaserUrl(): Promise<string> {
  if (cachedLibraryTeaser) return cachedLibraryTeaser;
  if (cachedLibraryTeaser === null) return FALLBACK_TEASER;
  try {
    const { fetchPublicLibraryVideos, pickStreamUrl } = await import(
      "@/lib/mediaLibrary"
    );
    const welcome = await fetchPublicLibraryVideos({ category: "welcome" });
    const teaser = await fetchPublicLibraryVideos({ category: "teaser" });
    const pick = welcome[0] || teaser[0];
    if (pick) {
      cachedLibraryTeaser = pickStreamUrl(pick);
      return cachedLibraryTeaser;
    }
  } catch {
    /* ignore */
  }
  cachedLibraryTeaser = null;
  return FALLBACK_TEASER;
}
