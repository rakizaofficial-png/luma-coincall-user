"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Coins, Crown, PhoneOff, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";

export function TrialPaywall({
  open,
  hostName,
  onContinueWithCoins,
  onClose,
}: {
  open: boolean;
  hostName: string;
  onContinueWithCoins: () => void;
  onClose: () => void;
}) {
  const { openTopUp } = useApp();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center bg-black/75 p-4 backdrop-blur-md sm:items-center">
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-[400px] overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-b from-ink-2 to-ink"
      >
        <div className="bg-gradient-to-r from-coral/30 via-gold/20 to-cyan/20 px-5 pb-4 pt-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
            Free trial ended
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold">
            Keep talking with {hostName}
          </h2>
          <p className="mt-2 text-sm text-muted">
            Your 30-second intro is complete. Top up coins or go VIP for
            cheaper minutes and priority matching.
          </p>
        </div>

        <div className="space-y-2.5 p-5">
          <button
            type="button"
            onClick={() => {
              openTopUp(20);
              onContinueWithCoins();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-coral py-3.5 text-sm font-bold text-white"
          >
            <Coins className="h-4 w-4" /> Buy coins & continue
          </button>
          <Link
            href="/premium"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/15 py-3.5 text-sm font-bold text-gold"
          >
            <Crown className="h-4 w-4" /> Unlock VIP · Best value
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-3 text-sm font-semibold text-muted"
          >
            <PhoneOff className="h-4 w-4" /> End call
          </button>
          <p className="flex items-center justify-center gap-1 pt-1 text-[10px] text-muted">
            <Sparkles className="h-3 w-3 text-gold" />
            Transparent pricing · cancel anytime
          </p>
        </div>
      </motion.div>
    </div>
  );
}
