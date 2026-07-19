/**
 * Shared call session on Firebase RTDB — free tier, no Cloud Functions.
 * Both user + host listen for status === "ended" and leave together.
 */

import {
  get,
  onValue,
  ref,
  set,
  update,
  type Unsubscribe,
} from "firebase/database";
import { getFirebaseDb, isFirebaseReady } from "@/lib/firebase";

export type CallSessionStatus = "active" | "ended";

export type CallSessionRecord = {
  id: string;
  channel: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  ratePerMinute: number;
  status: CallSessionStatus;
  startedAt: number;
  updatedAt: number;
  endedAt?: number;
  billedMinutes: number;
  coinsSpent: number;
  endReason?: string;
};

export async function upsertCallSession(
  input: Omit<CallSessionRecord, "billedMinutes" | "coinsSpent" | "updatedAt"> & {
    billedMinutes?: number;
    coinsSpent?: number;
  },
): Promise<CallSessionRecord | null> {
  if (!isFirebaseReady()) return null;
  const db = getFirebaseDb()!;
  const existing = await get(ref(db, `callSessions/${input.id}`));
  if (existing.exists()) {
    const prev = existing.val() as CallSessionRecord;
    if (prev.status === "ended") return prev;
    const merged: CallSessionRecord = {
      ...prev,
      ...input,
      billedMinutes: prev.billedMinutes || 0,
      coinsSpent: prev.coinsSpent || 0,
      updatedAt: Date.now(),
    };
    await update(ref(db, `callSessions/${input.id}`), merged);
    return merged;
  }
  const row: CallSessionRecord = {
    ...input,
    billedMinutes: input.billedMinutes || 0,
    coinsSpent: input.coinsSpent || 0,
    updatedAt: Date.now(),
  };
  await set(ref(db, `callSessions/${input.id}`), row);
  // Admin monitor mirror
  await set(ref(db, `activeCalls/${input.id}`), {
    id: input.id,
    channel: input.channel,
    hostUid: input.hostId,
    hostName: input.hostName,
    hostAvatar: input.hostAvatar,
    peerId: input.userId,
    peerName: input.userName,
    startedAt: input.startedAt,
    status: "active",
    coinsEarned: 0,
    seconds: 0,
  }).catch(() => undefined);
  return row;
}

export async function endCallSession(
  callId: string,
  endReason = "user",
): Promise<void> {
  if (!isFirebaseReady() || !callId) return;
  const db = getFirebaseDb()!;
  const now = Date.now();
  await update(ref(db, `callSessions/${callId}`), {
    status: "ended",
    endedAt: now,
    updatedAt: now,
    endReason,
  });
  await update(ref(db, `activeCalls/${callId}`), {
    status: "ended",
  }).catch(() => undefined);
  // Soft-remove admin dock after a beat
  setTimeout(() => {
    void import("firebase/database").then(({ remove }) => {
      void remove(ref(db, `activeCalls/${callId}`)).catch(() => undefined);
    });
  }, 1500);

  // Persist call logs for user + host (survives refresh)
  const snap = await get(ref(db, `callSessions/${callId}`));
  if (!snap.exists()) return;
  const session = snap.val() as CallSessionRecord;
  const durationSec = Math.max(
    0,
    Math.floor(((session.endedAt || now) - session.startedAt) / 1000),
  );
  const log = {
    id: callId,
    hostId: session.hostId,
    hostName: session.hostName,
    userId: session.userId,
    userName: session.userName,
    ratePerMinute: session.ratePerMinute,
    billedMinutes: session.billedMinutes || 0,
    coinsSpent: session.coinsSpent || 0,
    durationSec,
    startedAt: session.startedAt,
    endedAt: session.endedAt || now,
    endReason: session.endReason || endReason,
  };
  await Promise.all([
    set(ref(db, `callLogs/byUser/${session.userId}/${callId}`), log).catch(
      () => undefined,
    ),
    set(ref(db, `callLogs/byHost/${session.hostId}/${callId}`), log).catch(
      () => undefined,
    ),
    runHostCallStats(session.hostId, session.billedMinutes || 0).catch(
      () => undefined,
    ),
  ]);
}

async function runHostCallStats(hostId: string, minutes: number) {
  const { runTransaction } = await import("firebase/database");
  const db = getFirebaseDb()!;
  await runTransaction(ref(db, `hosts/${hostId}/stats`), (cur) => {
    const row = (cur || {}) as Record<string, number>;
    return {
      totalCallCoins: Number(row.totalCallCoins || 0),
      totalMinutes: Number(row.totalMinutes || 0),
      totalCalls: Number(row.totalCalls || 0) + 1,
      updatedAt: Date.now(),
    };
  });
  const weekKey = (() => {
    const d = new Date();
    const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const week = Math.ceil(
      ((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
    return `${tmp.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
  })();
  await runTransaction(
    ref(db, `hosts/${hostId}/weeklyEarnings/${weekKey}`),
    (cur) => {
      const row = (cur || {}) as Record<string, number | string>;
      return {
        ...row,
        weekKey,
        callCount: Number(row.callCount || 0) + 1,
        callMinutes: Number(row.callMinutes || 0),
        coins: Number(row.coins || 0),
        giftCoins: Number(row.giftCoins || 0),
        updatedAt: Date.now(),
      };
    },
  );
  void minutes;
}

/** Both sides: leave when status becomes ended */
export function listenCallSessionEnded(
  callId: string,
  onEnded: (session: CallSessionRecord) => void,
): Unsubscribe {
  if (!isFirebaseReady() || !callId) return () => undefined;
  const db = getFirebaseDb()!;
  return onValue(ref(db, `callSessions/${callId}`), (snap) => {
    if (!snap.exists()) return;
    const session = snap.val() as CallSessionRecord;
    if (session.status === "ended") onEnded(session);
  });
}

export async function getCallSession(
  callId: string,
): Promise<CallSessionRecord | null> {
  if (!isFirebaseReady() || !callId) return null;
  const snap = await get(ref(getFirebaseDb()!, `callSessions/${callId}`));
  if (!snap.exists()) return null;
  return snap.val() as CallSessionRecord;
}
