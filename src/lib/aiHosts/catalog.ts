import type { AiHostRecord } from "./types";
import { filterFemaleHosts, isFemaleHostProfile } from "@/lib/femaleHosts";
import {
  asianHostDp,
  pickMobileFakeCallClip,
} from "@/lib/welcomePush/mobileFakeCallVideos";

/**
 * Replace this in-memory table with your real DB (Postgres / Firestore / Supabase).
 * Until then, CDN paths resolve from NEXT_PUBLIC_AI_HOST_CDN when set.
 */
const CDN = (
  process.env.NEXT_PUBLIC_AI_HOST_CDN || ""
).replace(/\/$/, "");

function clip(hostId: string, file: "intro" | "loop", demo: string) {
  if (!CDN) return demo;
  return `${CDN}/${hostId}/${file}.mp4`;
}

function avatar(hostId: string, poster: string) {
  if (CDN) return `${CDN}/${hostId}/avatar.jpg`;
  return poster;
}

function packFor(i: number) {
  return pickMobileFakeCallClip(i);
}

/** AI Host Database — Asian automated-call profiles with custom DPs */
export const AI_HOST_TABLE: AiHostRecord[] = [
  {
    host_id: "ai_yuna",
    name: "Yuna",
    avatar: avatar("ai_yuna", asianHostDp(1)),
    video_url_1: clip("ai_yuna", "intro", packFor(0).videoUrl),
    video_url_2: clip("ai_yuna", "loop", packFor(1).videoUrl),
    age: 22,
    cost_per_minute: 80,
    country: "Korea",
    tags: ["chill", "night", "asian"],
    gender: "female",
  },
  {
    host_id: "ai_mei",
    name: "Mei",
    avatar: avatar("ai_mei", asianHostDp(2)),
    video_url_1: clip("ai_mei", "intro", packFor(1).videoUrl),
    video_url_2: clip("ai_mei", "loop", packFor(2).videoUrl),
    age: 24,
    cost_per_minute: 85,
    country: "China",
    tags: ["soft", "talk", "asian"],
    gender: "female",
  },
  {
    host_id: "ai_aya",
    name: "Aya",
    avatar: avatar("ai_aya", asianHostDp(3)),
    video_url_1: clip("ai_aya", "intro", packFor(2).videoUrl),
    video_url_2: clip("ai_aya", "loop", packFor(3).videoUrl),
    age: 23,
    cost_per_minute: 75,
    country: "Japan",
    tags: ["fashion", "calm", "asian"],
    gender: "female",
  },
  {
    host_id: "ai_hana",
    name: "Hana",
    avatar: avatar("ai_hana", asianHostDp(4)),
    video_url_1: clip("ai_hana", "intro", packFor(3).videoUrl),
    video_url_2: clip("ai_hana", "loop", packFor(4).videoUrl),
    age: 21,
    cost_per_minute: 70,
    country: "Indonesia",
    tags: ["sweet", "selfie", "asian"],
    gender: "female",
  },
  {
    host_id: "ai_rin",
    name: "Rin",
    avatar: avatar("ai_rin", asianHostDp(5)),
    video_url_1: clip("ai_rin", "intro", packFor(4).videoUrl),
    video_url_2: clip("ai_rin", "loop", packFor(5).videoUrl),
    age: 25,
    cost_per_minute: 90,
    country: "Japan",
    tags: ["glam", "vip", "asian"],
    gender: "female",
  },
  {
    host_id: "ai_sora",
    name: "Sora",
    avatar: avatar("ai_sora", asianHostDp(6)),
    video_url_1: clip("ai_sora", "intro", packFor(5).videoUrl),
    video_url_2: clip("ai_sora", "loop", packFor(6).videoUrl),
    age: 22,
    cost_per_minute: 80,
    country: "Korea",
    tags: ["party", "night", "asian"],
    gender: "female",
  },
  {
    host_id: "ai_lina",
    name: "Lina",
    avatar: avatar("ai_lina", asianHostDp(7)),
    video_url_1: clip("ai_lina", "intro", packFor(6).videoUrl),
    video_url_2: clip("ai_lina", "loop", packFor(0).videoUrl),
    age: 24,
    cost_per_minute: 85,
    country: "Thailand",
    tags: ["warm", "chat", "asian"],
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

  // Legacy ids + discover cards → Asian AI hosts
  const map: Record<string, string> = {
    ai_mira: "ai_yuna",
    ai_sofia: "ai_mei",
    ai_elena: "ai_rin",
    c1: "ai_yuna",
    c2: "ai_mei",
    c3: "ai_aya",
    c4: "ai_hana",
    c5: "ai_sora",
    c6: "ai_lina",
    mira: "ai_yuna",
    sofia: "ai_mei",
    aya: "ai_aya",
    elena: "ai_rin",
  };
  const mapped = map[requestedId] || map[requestedId.toLowerCase()];
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
