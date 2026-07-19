"use client";

import { motion } from "framer-motion";
import { Flame, X } from "lucide-react";
import { DAILY_CHECKIN_REWARDS } from "@/lib/engagement";
import { nextCheckInReward, useApp } from "@/lib/store";

export function DailyCheckInModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { engagement, claimCheckIn } = useApp();
  if (!open) return null;

  const claimed = engagement.checkInClaimedToday;
  const reward = nextCheckInReward(engagement);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-[400px] rounded-3xl border border-line bg-ink-2 p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1.5 font-display text-lg font-extrabold">
              <Flame className="h-5 w-5 text-coral" /> Daily Rewards
            </p>
            <p className="text-xs text-muted">
              Streak {engagement.streak} day
              {engagement.streak === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-ink-3 p-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-5 grid grid-cols-7 gap-1.5">
          {DAILY_CHECKIN_REWARDS.map((coins, i) => {
            const day = i + 1;
            const done = engagement.streak >= day && claimed;
            const today = !claimed && day === Math.min(engagement.streak + 1, 7);
            return (
              <div
                key={day}
                className={`rounded-xl px-1 py-2 text-center ${
                  done
                    ? "bg-coral/25 border border-coral/40"
                    : today
                      ? "bg-gold/15 border border-gold/40"
                      : "bg-ink-3 border border-line"
                }`}
              >
                <p className="text-[9px] text-muted">D{day}</p>
                <p className="mt-1 text-[11px] font-bold">{coins}</p>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          disabled={claimed}
          onClick={async () => {
            await claimCheckIn();
            onClose();
          }}
          className="w-full rounded-full bg-coral py-3.5 text-sm font-bold text-white disabled:opacity-40"
        >
          {claimed ? "Claimed today" : `Claim +${reward} coins`}
        </button>
      </motion.div>
    </div>
  );
}
