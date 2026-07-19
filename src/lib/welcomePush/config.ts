/**
 * Welcome Push Call Engine — conversion funnel configuration.
 * Demo hosts are used only when no real female hosts are online.
 */

import type { WelcomePaywallTier, WelcomePushHost } from "./types";

export type {
  WelcomePushPhase,
  WelcomePushHost,
  WelcomePaywallTier,
  WelcomeHostSource,
  WelcomeRotationHistory,
} from "./types";

/** @deprecated Prefer pickNextWelcomeCaller() — kept for type-compat imports */
export const WELCOME_PUSH_HOST: WelcomePushHost = {
  host_id: "sim_f_boot",
  name: "Mira",
  age: 23,
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&h=1200&fit=crop&q=80",
  teaser_video_url:
    process.env.NEXT_PUBLIC_WELCOME_TEASER_URL ||
    (process.env.NEXT_PUBLIC_AI_HOST_CDN
      ? `${process.env.NEXT_PUBLIC_AI_HOST_CDN.replace(/\/$/, "")}/ai_aisha_welcome/teaser.mp4`
      : "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"),
  country: "Korea",
  flag: "🇰🇷",
  language: "Korean · English",
  bio: "Just got free — private video?",
  interests: ["Fashion", "Travel"],
  level: 12,
  isVip: true,
  isVerified: true,
  isOnline: true,
  durationPreview: "a few minutes",
  message: "Hi, I'm online now.",
  messageId: "m01",
  source: "demo",
};

export function buildPaywallTiers(hostName: string): WelcomePaywallTier[] {
  return [
    {
      id: "unlock_5",
      headline: "Keep talking to her",
      sub: `${hostName} is still on the line · unlock 5 mins`,
      coins: 50,
      price: "$1.00",
      neon: "green",
    },
    {
      id: "popular_50",
      headline: "Most chosen · 50 Coins",
      sub: `Jump back to ${hostName} before she leaves`,
      coins: 50,
      price: "$0.99",
      neon: "pink",
      popular: true,
    },
    {
      id: "boost_300",
      headline: "Stay longer · 300 Coins",
      sub: "Private VIP minutes · she won’t wait forever",
      coins: 300,
      price: "$4.99",
      neon: "gold",
    },
  ];
}

/** Static fallback tiers (prefer buildPaywallTiers) */
export const WELCOME_PAYWALL_TIERS = buildPaywallTiers("her");

export const WELCOME_PUSH_CONFIG = {
  /** First lure after home / dashboard entry (3–5s) */
  launchDelayMinMs: 3_000,
  launchDelayMaxMs: 5_000,
  /** Recurring lure — keep pressure without spam */
  repeatEveryMinMs: 90_000,
  repeatEveryMaxMs: 2 * 60_000 + 30_000,
  /** Incoming modal + ringtone auto-end */
  ringDurationMinMs: 22_000,
  ringDurationMaxMs: 35_000,
  /** Teaser hard-cut → recharge paywall (retention push) */
  teaserCutMs: 3200,
  /** Paywall FOMO countdown */
  offerSeconds: 45,
  /** Don't reuse these many recent hosts / messages */
  hostCooldownCount: 10,
  messageCooldownCount: 14,
  storageKey: "luma_welcome_push_v4",
} as const;
