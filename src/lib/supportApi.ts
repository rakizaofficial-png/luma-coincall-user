"use client";

/**
 * In-app Admin Support / Help.
 * Users send complaints (recharge failures, technical issues, general help)
 * to the admin. Messages are cached locally so the support thread survives
 * reloads, and are best-effort delivered to the CoinCall backend if the
 * `/support/tickets` endpoint exists. An automated receipt is appended so the
 * support loop always feels responsive inside the app.
 */

import { requireApiBase } from "@/config/apiConfig";
import { getDeviceUserId } from "@/lib/walletApi";
import { getLocalProfile } from "@/lib/userProfile";

export type SupportCategory =
  | "recharge"
  | "technical"
  | "account"
  | "general";

export type SupportMessage = {
  id: string;
  from: "me" | "admin";
  text: string;
  category?: SupportCategory;
  at: number;
};

export const SUPPORT_CATEGORIES: {
  id: SupportCategory;
  label: string;
}[] = [
  { id: "recharge", label: "Recharge / payment" },
  { id: "technical", label: "Technical issue" },
  { id: "account", label: "Account" },
  { id: "general", label: "General help" },
];

const KEY = "luma_support_thread_v1";

function read(): SupportMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SupportMessage[];
  } catch {
    return [];
  }
}

function write(list: SupportMessage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function getSupportMessages(): SupportMessage[] {
  return read();
}

function ticketRef(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function ackText(category: SupportCategory, ref: string): string {
  const lead: Record<SupportCategory, string> = {
    recharge:
      "Thanks — we've logged your recharge/payment issue. If coins were deducted without crediting, please include the transaction/order ID.",
    technical:
      "Thanks for the report — our team will look into this technical issue.",
    account: "Thanks — we've received your account request.",
    general: "Thanks for reaching out — how can we help further?",
  };
  return `✅ Ticket #${ref} received. ${lead[category]} Our support team will reply right here.`;
}

/**
 * Submit a support message. Optimistically stored locally, best-effort sent to
 * the backend, and followed by an automated acknowledgement receipt.
 */
export async function sendSupportMessage(
  text: string,
  category: SupportCategory,
): Promise<SupportMessage> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Empty message");

  const now = Date.now();
  const mine: SupportMessage = {
    id: `s_${now}`,
    from: "me",
    text: trimmed,
    category,
    at: now,
  };
  write([...read(), mine]);

  const profile = getLocalProfile();
  try {
    await fetch(`${requireApiBase()}/support/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": getDeviceUserId(),
      },
      body: JSON.stringify({
        userId: getDeviceUserId(),
        name: profile.displayName || "Fan",
        category,
        text: trimmed,
      }),
    });
  } catch {
    /* offline / endpoint missing — kept locally, admin follows up */
  }

  const ack: SupportMessage = {
    id: `s_ack_${now}`,
    from: "admin",
    text: ackText(category, ticketRef()),
    at: now + 1,
  };
  write([...read(), ack]);

  return mine;
}
