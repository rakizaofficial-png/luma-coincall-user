"use client";

import { AnimatePresence, motion } from "framer-motion";

export function CoinDeductFlash({ amount }: { amount: number | null }) {
  return (
    <AnimatePresence>
      {amount != null && amount > 0 ? (
        <motion.div
          key={`deduct-${amount}`}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12 }}
          className="pointer-events-none absolute left-1/2 top-36 z-30 -translate-x-1/2 rounded-full border border-coral/40 bg-black/55 px-3 py-1.5 text-xs font-bold text-coral backdrop-blur"
        >
          −{amount} coins
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
