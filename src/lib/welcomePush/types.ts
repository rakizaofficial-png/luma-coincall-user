/** Welcome Push — types for diversified incoming-call simulation */

export type WelcomePushPhase =
  | "IDLE"
  | "INCOMING_CALL"
  | "TEASER_PLAYING"
  | "PAYWALL_BOOST"
  | "DONE";

export type WelcomeHostSource = "live" | "demo";

export type WelcomePushHost = {
  host_id: string;
  name: string;
  age: number;
  avatar: string;
  teaser_video_url: string;
  country: string;
  /** ISO-ish country flag emoji */
  flag: string;
  language: string;
  bio: string;
  interests: string[];
  level: number;
  isVip: boolean;
  isVerified: boolean;
  isOnline: boolean;
  /** e.g. "2–3 min" */
  durationPreview: string;
  /** Notification / lure message */
  message: string;
  messageId: string;
  source: WelcomeHostSource;
};

export type WelcomePaywallTier = {
  id: string;
  headline: string;
  sub: string;
  coins: number;
  price: string;
  neon: "green" | "pink" | "gold";
  popular?: boolean;
};

export type WelcomeRotationHistory = {
  recentHostIds: string[];
  recentMessageIds: string[];
  recentAvatarSeeds: string[];
  lastShownAt: number;
  showCount: number;
};
