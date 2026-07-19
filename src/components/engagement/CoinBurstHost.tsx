"use client";

import { CoinBurst } from "@/components/engagement/CoinBurst";
import { useApp } from "@/lib/store";

export function CoinBurstHost() {
  const { coinBurst } = useApp();
  return <CoinBurst amount={coinBurst} />;
}
