/**
 * Auto-generates diverse premium female host identities for simulated calls.
 * NEVER uses real male user IDs, placeholders, or low-quality avatars.
 */

import { isFemaleHostProfile } from "@/lib/femaleHosts";
import type { WelcomePushHost } from "./types";

const POOL_KEY = "luma_sim_female_pool_v1";
const POOL_SIZE = 36;

const CDN = (process.env.NEXT_PUBLIC_AI_HOST_CDN || "").replace(/\/$/, "");
export const PREMIUM_TEASER_URL =
  process.env.NEXT_PUBLIC_WELCOME_TEASER_URL ||
  (CDN
    ? `${CDN}/ai_aisha_welcome/teaser.mp4`
    : "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4");

/**
 * Curated high-engagement female portrait / glamour / beach aesthetic URLs
 * (Unsplash — fixed photo IDs, never random gender).
 */
export const SAFE_PREMIUM_FEMALE_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1525134479668-1bee5c7d5a3a?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c6?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504703395950-b8917a3b0a4c?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?w=900&h=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&h=1200&fit=crop&q=80",
] as const;

export const PREMIUM_FEMALE_AVATARS = SAFE_PREMIUM_FEMALE_AVATARS;

const FIRST_NAMES = [
  "Mira", "Sofia", "Aya", "Lina", "Elena", "Noor", "Zara", "Hana", "Priya",
  "Amira", "Yuna", "Luna", "Maya", "Sara", "Nina", "Isla", "Aria", "Leia",
  "Ruby", "Valentina", "Chloe", "Mei", "Fatima", "Aisha", "Layla", "Nadia",
  "Sienna", "Nova", "Camila", "Kiara", "Ananya", "Yasmine", "Bianca", "Rina",
  "Daria", "Selena",
] as const;

const LAST_NAMES = [
  "Rose", "Glow", "Moon", "Sweet", "Vibe", "Bloom", "Lux", "Sky", "Belle",
  "Nova", "Kiss", "Star", "Jade", "Pearl", "Flame",
] as const;

const LOCALES: { country: string; flag: string; language: string }[] = [
  { country: "Korea", flag: "🇰🇷", language: "Korean · English" },
  { country: "Brazil", flag: "🇧🇷", language: "Portuguese · English" },
  { country: "Japan", flag: "🇯🇵", language: "Japanese · English" },
  { country: "Turkey", flag: "🇹🇷", language: "Turkish · English" },
  { country: "Spain", flag: "🇪🇸", language: "Spanish · English" },
  { country: "UAE", flag: "🇦🇪", language: "Arabic · English" },
  { country: "India", flag: "🇮🇳", language: "Hindi · English" },
  { country: "Thailand", flag: "🇹🇭", language: "Thai · English" },
  { country: "Mexico", flag: "🇲🇽", language: "Spanish · English" },
  { country: "France", flag: "🇫🇷", language: "French · English" },
  { country: "Italy", flag: "🇮🇹", language: "Italian · English" },
  { country: "Colombia", flag: "🇨🇴", language: "Spanish · English" },
  { country: "Philippines", flag: "🇵🇭", language: "Tagalog · English" },
  { country: "USA", flag: "🇺🇸", language: "English" },
  { country: "UK", flag: "🇬🇧", language: "English" },
  { country: "Indonesia", flag: "🇮🇩", language: "Indonesian · English" },
];

const BIOS = [
  "Just got free — private video?",
  "Glam night mood · miss talking",
  "Beach energy · soft voice",
  "VIP host · waiting for you",
  "Feeling cute · answer me?",
  "Late-night private chat open",
  "Premium line · only a few calls",
  "Warm laughs · come closer",
];

const INTERESTS = [
  ["Fashion", "Travel"],
  ["Dance", "Beach"],
  ["Music", "Nightlife"],
  ["Fitness", "Selfie"],
  ["Luxury", "Chat"],
  ["Beauty", "ASMR"],
];

const BLOCKED_IDS = new Set([
  "me",
  "host",
  "user",
  "admin",
  "demo",
  "placeholder",
  "luna beauty",
  "luma fan",
]);

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().slice(0, 10);
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export type GeneratedFemaleProfile = {
  host_id: string;
  name: string;
  age: number;
  avatar: string;
  country: string;
  flag: string;
  language: string;
  bio: string;
  interests: string[];
  level: number;
  isVip: boolean;
  isVerified: boolean;
  gender: "female";
  quality: "premium";
  createdAt: number;
};

/** Reject male / placeholder / low-quality identities */
export function isAutoCallEligibleProfile(input: {
  id?: string;
  name?: string;
  gender?: string;
  avatar?: string;
}): boolean {
  const id = String(input.id || "").toLowerCase();
  const name = String(input.name || "").trim();
  if (!name || BLOCKED_IDS.has(name.toLowerCase())) return false;
  if (BLOCKED_IDS.has(id) || id === "me" || id.startsWith("luma_")) return false;
  // Never use device user IDs or male profiles
  if (!isFemaleHostProfile({ name, gender: input.gender || "female" })) {
    return false;
  }
  const gender = String(input.gender || "").toLowerCase();
  if (gender === "male" || gender === "m") return false;
  const avatar = String(input.avatar || "");
  if (!avatar || avatar.includes("dicebear") || avatar.includes("placeholder")) {
    return false;
  }
  // Block generic low-quality pravatar without curated seed
  if (avatar.includes("i.pravatar.cc") && !avatar.includes("luma-demo-f-")) {
    return false;
  }
  return true;
}

export function generatePremiumFemaleProfile(
  index = 0,
): GeneratedFemaleProfile {
  const locale = LOCALES[index % LOCALES.length]!;
  const first = FIRST_NAMES[index % FIRST_NAMES.length]!;
  const useLast = Math.random() < 0.55;
  const name = useLast ? `${first} ${pick(LAST_NAMES)}` : first;
  const avatar =
    SAFE_PREMIUM_FEMALE_AVATARS[index % SAFE_PREMIUM_FEMALE_AVATARS.length]!;

  const profile: GeneratedFemaleProfile = {
    host_id: `sim_f_${uid()}`,
    name,
    age: 21 + (index % 8),
    avatar,
    country: locale.country,
    flag: locale.flag,
    language: locale.language,
    bio: pick(BIOS),
    interests: [...pick(INTERESTS)],
    level: 10 + (index % 10),
    isVip: Math.random() < 0.7,
    isVerified: true,
    gender: "female",
    quality: "premium",
    createdAt: Date.now(),
  };

  if (!isAutoCallEligibleProfile(profile)) {
    // Extremely defensive re-roll
    return generatePremiumFemaleProfile(index + 7);
  }
  return profile;
}

function readPool(): GeneratedFemaleProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(POOL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GeneratedFemaleProfile[];
    return Array.isArray(parsed)
      ? parsed.filter((p) => isAutoCallEligibleProfile(p))
      : [];
  } catch {
    return [];
  }
}

function writePool(pool: GeneratedFemaleProfile[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(POOL_KEY, JSON.stringify(pool));
  } catch {
    /* ignore */
  }
}

/** Ensure a rotating pool of unique premium female identities exists */
export function ensurePremiumFemalePool(): GeneratedFemaleProfile[] {
  let pool = readPool();
  if (pool.length >= POOL_SIZE * 0.6) return pool;

  const next: GeneratedFemaleProfile[] = [...pool];
  const usedNames = new Set(next.map((p) => p.name.toLowerCase()));
  const usedAvatars = new Set(next.map((p) => p.avatar));

  for (let i = 0; next.length < POOL_SIZE && i < POOL_SIZE * 3; i++) {
    const p = generatePremiumFemaleProfile(i + next.length);
    if (usedNames.has(p.name.toLowerCase())) continue;
    if (usedAvatars.has(p.avatar) && next.length < SAFE_PREMIUM_FEMALE_AVATARS.length) {
      // allow avatar reuse only after exhausting unique set
    }
    usedNames.add(p.name.toLowerCase());
    usedAvatars.add(p.avatar);
    next.push(p);
  }
  writePool(next);
  return next;
}

/** Pick next profile avoiding recent host ids */
export function pickGeneratedFemaleProfile(
  recentHostIds: string[],
): GeneratedFemaleProfile {
  const pool = ensurePremiumFemalePool();
  const cool = new Set(recentHostIds.slice(0, 10));
  const fresh = pool.filter((p) => !cool.has(p.host_id));
  const choice = fresh.length ? pick(fresh) : pick(pool);

  // Soft refresh: occasionally inject a brand-new identity
  if (Math.random() < 0.22) {
    const newborn = generatePremiumFemaleProfile(Date.now() % 100);
    const updated = [newborn, ...pool].slice(0, POOL_SIZE + 8);
    writePool(updated);
    return newborn;
  }
  return choice;
}

export function generatedToWelcomeHost(
  profile: GeneratedFemaleProfile,
  message: { id: string; text: string },
  durationPreview: string,
): WelcomePushHost {
  return {
    host_id: profile.host_id,
    name: profile.name,
    age: profile.age,
    avatar: profile.avatar,
    teaser_video_url: PREMIUM_TEASER_URL,
    country: profile.country,
    flag: profile.flag,
    language: profile.language,
    bio: profile.bio,
    interests: profile.interests,
    level: profile.level,
    isVip: profile.isVip,
    isVerified: profile.isVerified,
    isOnline: true,
    durationPreview,
    message: message.text,
    messageId: message.id,
    source: "demo",
  };
}
