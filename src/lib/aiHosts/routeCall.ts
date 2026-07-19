import { fetchLiveHosts, type LiveHost } from "@/lib/api";
import { filterFemaleHosts, isFemaleHostProfile } from "@/lib/femaleHosts";
import { resolveAiHostForRequest } from "./catalog";
import type { CallRouteDecision } from "./types";

/**
 * Backend routing action (client-callable + mirrored by /api/call-route).
 * Automated / simulated paths are female-only.
 */
export async function routeOneToOneCall(
  requestedHostId: string,
): Promise<CallRouteDecision> {
  let hosts: LiveHost[] = [];
  try {
    hosts = await fetchLiveHosts();
  } catch {
    hosts = [];
  }

  const online = hosts.filter((h) => h.isOnline && !h.isOnCall);
  const femaleOnline = filterFemaleHosts(online);
  const realHostsOnline = femaleOnline.length;
  const matched = online.find((h) => h.id === requestedHostId) ?? null;

  if (matched && isFemaleHostProfile(matched)) {
    return {
      transport: "agora_live",
      reason: "Requested female host is online — Agora bridge",
      realHostsOnline,
      aiHost: null,
      liveHostId: matched.id,
    };
  }

  if (matched && !isFemaleHostProfile(matched)) {
    const aiHost = resolveAiHostForRequest(requestedHostId);
    return {
      transport: "ai_prerecorded",
      reason: "Male host blocked from auto route — female AI fallback",
      realHostsOnline,
      aiHost,
      liveHostId: null,
    };
  }

  if (realHostsOnline === 0) {
    const aiHost = resolveAiHostForRequest(requestedHostId);
    return {
      transport: "ai_prerecorded",
      reason: "Zero female hosts online — AI Host Database fallback",
      realHostsOnline: 0,
      aiHost,
      liveHostId: null,
    };
  }

  const aiHost = resolveAiHostForRequest(requestedHostId);
  return {
    transport: "ai_prerecorded",
    reason: "Requested host unavailable — female AI fallback",
    realHostsOnline,
    aiHost,
    liveHostId: null,
  };
}

/** Random latency 2000–4000ms to mimic server handshake */
export function fakeHandshakeDelayMs(): number {
  return 2000 + Math.floor(Math.random() * 2001);
}
