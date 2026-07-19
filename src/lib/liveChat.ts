"use client";

/**
 * Live chat for Host-Only streams.
 * Prefers Firebase RTDB (same paths as CoinCall host app).
 * Falls back to CoinCall REST + WebSocket when Firebase is not configured.
 */

import {
  onValue,
  push,
  ref,
  set,
  type Unsubscribe,
} from "firebase/database";
import { getFirebaseDb, isFirebaseReady } from "@/lib/firebase";
import {
  fetchLiveComments,
  postLiveComment,
  type LiveComment,
} from "@/lib/liveApi";
import { getRealtimeClient } from "@/lib/realtime/websocket";

export function listenLiveComments(
  roomId: string,
  userId: string,
  onComments: (items: LiveComment[]) => void,
): () => void {
  const db = getFirebaseDb();
  if (isFirebaseReady() && db) {
    const unsub: Unsubscribe = onValue(
      ref(db, `liveRooms/${roomId}/comments`),
      (snap) => {
        if (!snap.exists()) {
          onComments([]);
          return;
        }
        const val = snap.val() as Record<string, Omit<LiveComment, "id">>;
        onComments(
          Object.entries(val)
            .map(([id, row]) => ({ id, ...row }))
            .sort((a, b) => a.createdAt - b.createdAt)
            .slice(-80),
        );
      },
    );
    return () => unsub();
  }

  let dead = false;
  const merge = new Map<string, LiveComment>();

  const emit = () => {
    if (dead) return;
    onComments(
      [...merge.values()].sort((a, b) => a.createdAt - b.createdAt).slice(-80),
    );
  };

  const load = async () => {
    const rows = await fetchLiveComments(roomId);
    for (const c of rows) merge.set(c.id, c);
    emit();
  };

  void load();
  const poll = setInterval(() => void load(), 4000);

  const rt = getRealtimeClient(userId);
  rt.connect();
  const off = rt.subscribe((ev) => {
    if (ev.type !== "live:comment") return;
    const payload = ev.payload as {
      roomId?: string;
      comment?: LiveComment;
    };
    if (payload.roomId !== roomId || !payload.comment) return;
    merge.set(payload.comment.id, payload.comment);
    emit();
  });

  return () => {
    dead = true;
    clearInterval(poll);
    off();
  };
}

export async function sendLiveComment(input: {
  roomId: string;
  userId: string;
  userName: string;
  text: string;
}) {
  const db = getFirebaseDb();
  if (isFirebaseReady() && db) {
    const r = push(ref(db, `liveRooms/${input.roomId}/comments`));
    const row = {
      userId: input.userId,
      userName: input.userName,
      text: input.text,
      createdAt: Date.now(),
      kind: "comment" as const,
    };
    await set(r, row);
    // Mirror to API so hosts without FB still see it via WS
    void postLiveComment(input).catch(() => undefined);
    return;
  }
  await postLiveComment(input);
}

export function listenRoomGiftCoins(
  roomId: string,
  onCoins: (giftCoins: number, viewers?: number) => void,
): () => void {
  const db = getFirebaseDb();
  if (isFirebaseReady() && db) {
    const unsub = onValue(ref(db, `liveRooms/${roomId}`), (snap) => {
      if (!snap.exists()) return;
      const v = snap.val() as { giftCoins?: number; viewers?: number };
      onCoins(Number(v.giftCoins || 0), Number(v.viewers || 0));
    });
    return () => unsub();
  }
  return () => undefined;
}
