/**
 * Local user profile — created automatically on first app open.
 * Same device ID is used for wallet, IAP purchases, and calls.
 * Each userId gets a stable unique display name + avatar.
 */

import { apiConfig } from "@/config/apiConfig";

export type UserProfile = {
  userId: string;
  displayName: string;
  avatarUrl: string;
  createdAt: number;
  isNew: boolean;
  appId?: string;
};

const PROFILE_KEY = "luma_user_profile_v1";
const WELCOME_CLAIMED_KEY = "luma_welcome_claimed_v1";

const ADJECTIVES = [
  "Swift",
  "Bright",
  "Calm",
  "Bold",
  "Lucky",
  "Cosmic",
  "Neon",
  "Silent",
  "Golden",
  "Coral",
  "Velvet",
  "Crystal",
  "Mystic",
  "Solar",
  "Nova",
  "Jade",
  "Ruby",
  "Azure",
  "Ember",
  "Frost",
];

const NOUNS = [
  "Fox",
  "Star",
  "Wave",
  "Owl",
  "Spark",
  "Moon",
  "Leaf",
  "Hawk",
  "Bloom",
  "Comet",
  "River",
  "Lynx",
  "Pulse",
  "Drift",
  "Flame",
  "Pearl",
  "Echo",
  "Orbit",
  "Skye",
  "Zen",
];

const AVATAR_STYLES = [
  "thumbs",
  "fun-emoji",
  "avataaars",
  "bottts",
  "lorelei",
  "notionists",
  "personas",
  "shapes",
  "adventurer",
  "big-smile",
] as const;

function hashId(userId: string): number {
  let h = 2166136261;
  for (let i = 0; i < userId.length; i++) {
    h ^= userId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable unique name derived from userId (never shared across users). */
export function uniqueDisplayName(userId: string): string {
  const h = hashId(userId);
  const adj = ADJECTIVES[h % ADJECTIVES.length];
  const noun = NOUNS[(h >>> 8) % NOUNS.length];
  const num = (h % 90) + 10;
  return `${adj} ${noun}${num}`;
}

/** Stable unique avatar URL derived from userId. */
export function uniqueAvatarUrl(userId: string): string {
  const h = hashId(userId);
  const style = AVATAR_STYLES[h % AVATAR_STYLES.length];
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(userId)}`;
}

export function isGenericDisplayName(name: string | undefined | null): boolean {
  const n = (name || "").trim();
  if (!n) return true;
  if (n === "Luma Fan") return true;
  if (/^Luma [A-Z0-9]{4}$/i.test(n)) return true;
  return false;
}

function readRaw(): Omit<UserProfile, "isNew"> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Omit<UserProfile, "isNew">;
    if (!parsed?.userId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeRaw(profile: Omit<UserProfile, "isNew">) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

/** Stable device user id (also mirrored in apiConfig.deviceUserKey) */
export function ensureDeviceUserId(): string {
  if (typeof window === "undefined") return "server";
  const key = apiConfig.deviceUserKey;
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      try {
        id = sessionStorage.getItem(key);
      } catch {
        id = null;
      }
      if (!id) {
        id = `luma_${crypto.randomUUID()}`;
      }
      localStorage.setItem(key, id);
      try {
        sessionStorage.setItem(key, id);
      } catch {
        /* ignore */
      }
    }
    return id;
  } catch {
    try {
      let id = sessionStorage.getItem(key);
      if (!id) {
        id = `luma_${crypto.randomUUID()}`;
        sessionStorage.setItem(key, id);
      }
      return id;
    } catch {
      return `luma_ephemeral_${crypto.randomUUID()}`;
    }
  }
}

/**
 * Create or load local profile. Call once on app boot.
 * Returns `isNew: true` the first time this device gets a profile.
 */
export function ensureLocalProfile(): UserProfile {
  const userId = ensureDeviceUserId();
  const existing = readRaw();

  if (existing && existing.userId === userId) {
    let displayName = existing.displayName;
    let avatarUrl = existing.avatarUrl;
    let changed = false;
    if (isGenericDisplayName(displayName)) {
      displayName = uniqueDisplayName(userId);
      changed = true;
    }
    if (!avatarUrl || avatarUrl.includes("Luma+Fan")) {
      avatarUrl = uniqueAvatarUrl(userId);
      changed = true;
    }
    if (changed) {
      const next = {
        userId,
        displayName,
        avatarUrl,
        createdAt: existing.createdAt,
        appId: existing.appId,
      };
      writeRaw(next);
      return { ...next, isNew: false };
    }
    return { ...existing, isNew: false };
  }

  const displayName =
    existing?.displayName && !isGenericDisplayName(existing.displayName)
      ? existing.displayName
      : uniqueDisplayName(userId);
  const avatarUrl = existing?.avatarUrl || uniqueAvatarUrl(userId);
  const createdAt = existing?.createdAt || Date.now();
  const profile = { userId, displayName, avatarUrl, createdAt };
  writeRaw(profile);
  return { ...profile, isNew: !existing };
}

export function getLocalProfile(): UserProfile {
  return ensureLocalProfile();
}

export function updateLocalDisplayName(displayName: string): UserProfile {
  const current = ensureLocalProfile();
  const next = {
    ...current,
    displayName: displayName.trim() || current.displayName,
  };
  writeRaw({
    userId: next.userId,
    displayName: next.displayName,
    avatarUrl: next.avatarUrl,
    createdAt: next.createdAt,
    appId: next.appId,
  });
  return { ...next, isNew: false };
}

export function updateLocalAvatar(avatarUrl: string): UserProfile {
  const current = ensureLocalProfile();
  const next = {
    ...current,
    avatarUrl: avatarUrl.trim() || current.avatarUrl,
  };
  writeRaw({
    userId: next.userId,
    displayName: next.displayName,
    avatarUrl: next.avatarUrl,
    createdAt: next.createdAt,
    appId: next.appId,
  });
  return { ...next, isNew: false };
}

/** Persist that this device already received the one-time welcome bonus */
export function markWelcomeBonusClaimed(userId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const id = userId || ensureDeviceUserId();
    localStorage.setItem(WELCOME_CLAIMED_KEY, id);
  } catch {
    /* ignore */
  }
}

export function hasWelcomeBonusClaimed(userId?: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const claimed = localStorage.getItem(WELCOME_CLAIMED_KEY);
    if (!claimed) return false;
    const id = userId || ensureDeviceUserId();
    return claimed === id;
  } catch {
    return false;
  }
}

export function shortUserId(userId: string): string {
  if (!userId) return "—";
  if (userId.length <= 12) return userId;
  return `${userId.slice(0, 8)}…${userId.slice(-4)}`;
}
