/**
 * Server-authoritative engagement rewards (daily / spin / status).
 */

import { requireApiBase } from "@/config/apiConfig";
import { ensureDeviceUserId, ensureInstallId } from "@/lib/userProfile";

export type RewardStatus = {
  welcomeClaimed: boolean;
  welcomeAmount: number;
  dailyAmount: number;
  dailyReady: boolean;
  dailyReadyAt: number | null;
  dailySecondsLeft: number;
  spinsRemaining: number;
  spinsMax: number;
  spinMin: number;
  spinMax: number;
};

export type SpinPrize = {
  id: string;
  label: string;
  coins: number;
  weight: number;
  color: string;
};

async function rewardsFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const base = requireApiBase();
  const userId = ensureDeviceUserId();
  const installId = ensureInstallId();
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
      "X-Install-Id": installId,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `API ${res.status}`);
  return data as T;
}

export async function fetchRewardStatus(): Promise<RewardStatus> {
  const userId = ensureDeviceUserId();
  const data = await rewardsFetch<{ status: RewardStatus }>(
    `/rewards/status?userId=${encodeURIComponent(userId)}`,
  );
  return data.status;
}

export async function claimDailyRewardApi(): Promise<{
  coins: number;
  reason: string;
  status: RewardStatus;
  wallet: { coinBalance: number; xp: number };
}> {
  const userId = ensureDeviceUserId();
  return rewardsFetch("/rewards/daily", {
    method: "POST",
    body: JSON.stringify({ userId, installId: ensureInstallId() }),
  });
}

export async function claimSpinRewardApi(): Promise<{
  coins: number;
  reason: string;
  status: RewardStatus;
  wallet: { coinBalance: number; xp: number };
  prize: SpinPrize;
}> {
  const userId = ensureDeviceUserId();
  return rewardsFetch("/rewards/spin", {
    method: "POST",
    body: JSON.stringify({ userId, installId: ensureInstallId() }),
  });
}

export async function claimReferralRewardApi(code: string): Promise<{
  coins: number;
  reason: string;
  status: RewardStatus;
  wallet: { coinBalance: number; xp: number };
}> {
  const userId = ensureDeviceUserId();
  return rewardsFetch("/rewards/referral", {
    method: "POST",
    body: JSON.stringify({
      userId,
      code,
      installId: ensureInstallId(),
    }),
  });
}
