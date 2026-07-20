/**
 * Mobile fake-call media — Asian profile DPs (custom) + portrait waiting clips.
 * All automated-call posters use the curated Asian host set.
 */

export type MobileFakeCallClip = {
  id: string;
  region: "asian" | "indian" | "pakistani" | "global";
  /** Glamorous woman still — used as Ken Burns + video poster */
  poster: string;
  /** Portrait (9:16) MP4 when available; otherwise empty → Ken Burns only */
  videoUrl: string;
  vibe: "glam" | "selfie" | "fashion" | "soft";
};

/** Public site origin for static DPs under /hosts/asian */
function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://luma-user.onrender.com"
  ).replace(/\/$/, "");
}

/** Custom Asian automated-call display pictures */
export function asianHostDp(n: number): string {
  const i = ((Math.floor(n) - 1) % 7 + 7) % 7 + 1;
  return `${siteOrigin()}/hosts/asian/${String(i).padStart(2, "0")}.png`;
}

/** Verified portrait Pexels files (720×1280) — woman on camera */
const PEXELS_PORTRAIT = {
  waiting_01:
    "https://videos.pexels.com/video-files/2499611/2499611-hd_720_1280_30fps.mp4",
  waiting_02:
    "https://videos.pexels.com/video-files/6010878/6010878-hd_720_1280_30fps.mp4",
} as const;

/**
 * All automated-call packs use Asian custom DPs (user-provided photos).
 * Videos stay as portrait waiting clips for the ring UI.
 */
export const MOBILE_FAKE_CALL_CLIPS: readonly MobileFakeCallClip[] = [
  {
    id: "asia_dp_01",
    region: "asian",
    vibe: "selfie",
    poster: asianHostDp(1),
    videoUrl: PEXELS_PORTRAIT.waiting_01,
  },
  {
    id: "asia_dp_02",
    region: "asian",
    vibe: "soft",
    poster: asianHostDp(2),
    videoUrl: PEXELS_PORTRAIT.waiting_02,
  },
  {
    id: "asia_dp_03",
    region: "asian",
    vibe: "fashion",
    poster: asianHostDp(3),
    videoUrl: PEXELS_PORTRAIT.waiting_01,
  },
  {
    id: "asia_dp_04",
    region: "asian",
    vibe: "glam",
    poster: asianHostDp(4),
    videoUrl: PEXELS_PORTRAIT.waiting_02,
  },
  {
    id: "asia_dp_05",
    region: "asian",
    vibe: "soft",
    poster: asianHostDp(5),
    videoUrl: PEXELS_PORTRAIT.waiting_01,
  },
  {
    id: "asia_dp_06",
    region: "asian",
    vibe: "glam",
    poster: asianHostDp(6),
    videoUrl: PEXELS_PORTRAIT.waiting_02,
  },
  {
    id: "asia_dp_07",
    region: "asian",
    vibe: "fashion",
    poster: asianHostDp(7),
    videoUrl: PEXELS_PORTRAIT.waiting_01,
  },
];

/** Optional override: NEXT_PUBLIC_FAKE_CALL_VIDEOS=url1,url2 */
export function envFakeCallVideos(): string[] {
  const raw = (process.env.NEXT_PUBLIC_FAKE_CALL_VIDEOS || "").trim();
  if (!raw) return [];
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.startsWith("http://") || s.startsWith("https://"));
}

export function pickMobileFakeCallClip(index = 0): MobileFakeCallClip {
  const env = envFakeCallVideos();
  if (env.length) {
    const i = ((index % env.length) + env.length) % env.length;
    const base = MOBILE_FAKE_CALL_CLIPS[i % MOBILE_FAKE_CALL_CLIPS.length]!;
    return { ...base, id: `env_${i}`, videoUrl: env[i]! };
  }
  const i =
    ((index % MOBILE_FAKE_CALL_CLIPS.length) + MOBILE_FAKE_CALL_CLIPS.length) %
    MOBILE_FAKE_CALL_CLIPS.length;
  return MOBILE_FAKE_CALL_CLIPS[i]!;
}

export function pickRandomMobileFakeCallClip(
  avoidIds: string[] = [],
  preferRegions?: Array<MobileFakeCallClip["region"]>,
): MobileFakeCallClip {
  const env = envFakeCallVideos();
  if (env.length) {
    const url = env[Math.floor(Math.random() * env.length)]!;
    const base =
      MOBILE_FAKE_CALL_CLIPS[
        Math.floor(Math.random() * MOBILE_FAKE_CALL_CLIPS.length)
      ]!;
    return { ...base, id: `env_${url.slice(-10)}`, videoUrl: url };
  }

  let pool = [...MOBILE_FAKE_CALL_CLIPS];
  if (preferRegions?.length) {
    const preferred = pool.filter((c) => preferRegions.includes(c.region));
    if (preferred.length) pool = preferred;
  }
  const cool = new Set(avoidIds.slice(0, 6));
  const fresh = pool.filter((c) => !cool.has(c.id));
  const finalPool = fresh.length ? fresh : pool;
  return finalPool[Math.floor(Math.random() * finalPool.length)]!;
}

export const FAKE_CALL_PREVIEW_MS = 30_000;
