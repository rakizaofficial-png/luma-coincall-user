import type { AiHostRecord } from "./types";
import { filterFemaleHosts, isFemaleHostProfile } from "@/lib/femaleHosts";

/**
 * Replace this in-memory table with your real DB (Postgres / Firestore / Supabase).
 * Until then, CDN paths resolve from NEXT_PUBLIC_AI_HOST_CDN when set.
 */
const CDN = (
  process.env.NEXT_PUBLIC_AI_HOST_CDN || ""
).replace(/\/$/, "");

/**
 * Public demo MP4s used ONLY when CDN is unset.
 * Swap these for your bucket clips — portrait front-camera style preferred.
 */
const DEMO_INTRO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
const DEMO_LOOP =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

function clip(hostId: string, file: "intro" | "loop", demo: string) {
  if (!CDN) return demo;
  return `${CDN}/${hostId}/${file}.mp4`;
}

function avatar(hostId: string, seed: string) {
  if (CDN) return `${CDN}/${hostId}/avatar.jpg`;
  return `https://i.pravatar.cc/800?u=${encodeURIComponent(seed)}`;
}

/** AI Host Database Table (seed) — premium female hosts only */
export const AI_HOST_TABLE: AiHostRecord[] = [
  {
    host_id: "ai_mira",
    name: "Mira",
    avatar: avatar("ai_mira", "ai-mira-luma"),
    video_url_1: clip("ai_mira", "intro", DEMO_INTRO),
    video_url_2: clip("ai_mira", "loop", DEMO_LOOP),
    age: 23,
    cost_per_minute: 80,
    country: "Korea",
    tags: ["chill", "night"],
    gender: "female",
  },
  {
    host_id: "ai_sofia",
    name: "Sofia",
    avatar: avatar("ai_sofia", "ai-sofia-luma"),
    video_url_1: clip("ai_sofia", "intro", DEMO_INTRO),
    video_url_2: clip("ai_sofia", "loop", DEMO_LOOP),
    age: 25,
    cost_per_minute: 95,
    country: "Brazil",
    tags: ["dance", "fun"],
    gender: "female",
  },
  {
    host_id: "ai_aya",
    name: "Aya",
    avatar: avatar("ai_aya", "ai-aya-luma"),
    video_url_1: clip("ai_aya", "intro", DEMO_INTRO),
    video_url_2: clip("ai_aya", "loop", DEMO_LOOP),
    age: 22,
    cost_per_minute: 70,
    country: "Japan",
    tags: ["calm", "talk"],
    gender: "female",
  },
  {
    host_id: "ai_lina",
    name: "Lina",
    avatar: avatar("ai_lina", "ai-lina-luma"),
    video_url_1: clip("ai_lina", "intro", DEMO_INTRO),
    video_url_2: clip("ai_lina", "loop", DEMO_LOOP),
    age: 24,
    cost_per_minute: 85,
    country: "Turkey",
    tags: ["party", "warm"],
    gender: "female",
  },
  {
    host_id: "ai_elena",
    name: "Elena",
    avatar: avatar("ai_elena", "ai-elena-luma"),
    video_url_1: clip("ai_elena", "intro", DEMO_INTRO),
    video_url_2: clip("ai_elena", "loop", DEMO_LOOP),
    age: 27,
    cost_per_minute: 100,
    country: "Spain",
    tags: ["music", "premium"],
    gender: "female",
  },
];

const FEMALE_AI_HOSTS = filterFemaleHosts(AI_HOST_TABLE);

export function getAiHostById(hostId: string): AiHostRecord | null {
  const row =
    FEMALE_AI_HOSTS.find((h) => h.host_id === hostId) ||
    FEMALE_AI_HOSTS.find((h) =>
      hostId.includes(h.host_id.replace("ai_", "")),
    ) ||
    null;
  if (row && !isFemaleHostProfile(row)) return null;
  return row;
}

/** Map a UI creator / live host id onto the closest AI persona (female only) */
export function resolveAiHostForRequest(requestedId: string): AiHostRecord {
  const direct = getAiHostById(requestedId);
  if (direct) return direct;

  const map: Record<string, string> = {
    c1: "ai_mira",
    c2: "ai_sofia",
    c3: "ai_aya",
    c4: "ai_lina",
    c5: "ai_mira",
    c6: "ai_elena",
  };
  const mapped = map[requestedId];
  if (mapped) {
    const row = getAiHostById(mapped);
    if (row) return row;
  }

  const table = FEMALE_AI_HOSTS.length ? FEMALE_AI_HOSTS : AI_HOST_TABLE;
  let hash = 0;
  for (let i = 0; i < requestedId.length; i++) {
    hash = (hash + requestedId.charCodeAt(i) * (i + 1)) % table.length;
  }
  return table[hash]!;
}

export function listAiHosts(): AiHostRecord[] {
  return FEMALE_AI_HOSTS.length ? FEMALE_AI_HOSTS : AI_HOST_TABLE;
}
