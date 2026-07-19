import type { Achievement, Mission, SpinPrize } from "./types";

export const DAILY_CHECKIN_REWARDS = [20, 30, 40, 55, 70, 90, 150] as const;

export const SPIN_COST = 0;
export const MAX_SPINS_PER_DAY = 3;

export const SPIN_PRIZES: SpinPrize[] = [
  { id: "c10", label: "10", coins: 10, weight: 28, color: "#3d8bfd" },
  { id: "c25", label: "25", coins: 25, weight: 22, color: "#00c9a7" },
  { id: "c50", label: "50", coins: 50, weight: 18, color: "#ffb800" },
  { id: "c80", label: "80", coins: 80, weight: 12, color: "#ff6b4a" },
  { id: "c120", label: "120", coins: 120, weight: 8, color: "#ff2a7a" },
  { id: "c200", label: "200", coins: 200, weight: 5, color: "#c44dff" },
  { id: "c0", label: "Try again", coins: 0, weight: 5, color: "#5a5268" },
  { id: "c500", label: "500!", coins: 500, weight: 2, color: "#ffd700" },
];

export const WEEKLY_MISSIONS: Mission[] = [
  { id: "open_app", title: "Open Luma today", reward: 20, xp: 15, icon: "☀️", target: 1 },
  { id: "watch_live", title: "Watch a live for 2 min", reward: 40, xp: 25, icon: "📺", target: 1 },
  { id: "send_gift", title: "Send a gift", reward: 60, xp: 40, icon: "🎁", target: 1 },
  { id: "start_call", title: "Start a 1v1 call", reward: 80, xp: 50, icon: "📞", target: 1 },
  { id: "follow_host", title: "Follow a host", reward: 30, xp: 20, icon: "❤️", target: 1 },
  { id: "spin_once", title: "Spin the Lucky Wheel", reward: 25, xp: 15, icon: "🎰", target: 1 },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_call", title: "First Connection", desc: "Complete your first call", reward: 50, icon: "📞" },
  { id: "streak_3", title: "On Fire", desc: "3-day check-in streak", reward: 75, icon: "🔥" },
  { id: "streak_7", title: "Week Warrior", desc: "7-day check-in streak", reward: 200, icon: "⚡" },
  { id: "first_gift", title: "Generous Soul", desc: "Send your first gift", reward: 40, icon: "🎁" },
  { id: "level_5", title: "Rising Star", desc: "Reach level 5", reward: 100, icon: "⭐" },
  { id: "vip_join", title: "VIP Circle", desc: "Activate a VIP plan", reward: 150, icon: "👑" },
  { id: "spin_win", title: "Lucky Charm", desc: "Win 100+ coins on spin", reward: 30, icon: "🍀" },
  { id: "referral_1", title: "Ambassador", desc: "Refer a friend", reward: 100, icon: "🤝" },
];

export const XP_PER_LEVEL = 200;
export const FREE_TRIAL_SECONDS = 30;
export const REFERRAL_REWARD = 100;

export const HOST_CATEGORIES = [
  "All",
  "Trending",
  "New",
  "Top Rated",
  "Nearby",
  "Music",
  "Chill",
  "Party",
  "Language",
] as const;

export type HostCategory = (typeof HOST_CATEGORIES)[number];
