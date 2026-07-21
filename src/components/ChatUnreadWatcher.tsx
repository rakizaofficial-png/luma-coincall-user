"use client";

import { useEffect } from "react";
import { getRealtimeClient } from "@/lib/realtime/websocket";
import { getDeviceUserId } from "@/lib/walletApi";
import { noteIncomingDm } from "@/lib/dmStore";

/**
 * Global DM listener mounted at the app root so incoming chat messages bump
 * the unread badge even when the user is not on the Messages screen. Reuses
 * the singleton realtime socket, so no extra connection is opened.
 */
export function ChatUnreadWatcher() {
  useEffect(() => {
    const userId = getDeviceUserId();
    if (!userId) return;
    const rt = getRealtimeClient(userId);
    rt.connect();
    const off = rt.subscribe((ev) => {
      if ((ev as { type?: string }).type !== "dm:message") return;
      noteIncomingDm(
        userId,
        (ev as { payload?: Parameters<typeof noteIncomingDm>[1] }).payload,
      );
    });
    return () => {
      off();
    };
  }, []);

  return null;
}
