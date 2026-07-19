"use client";

import { AnimatePresence, motion } from "framer-motion";

export function CoinBurst({ amount }: { amount: number }) {
  if (!amount) return null;
  const bits = Array.from({ length: 12 }, (_, i) => i);

  return (
    <AnimatePresence>
      <div className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-full border border-gold/40 bg-ink/80 px-5 py-3 backdrop-blur-xl"
        >
          <p className="font-display text-2xl font-extrabold text-gold">
            +{amount} 🪙
          </p>
        </motion.div>
        {bits.map((i) => (
          <motion.span
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos((i / 12) * Math.PI * 2) * 90,
              y: Math.sin((i / 12) * Math.PI * 2) * 90 - 20,
              scale: 0.4,
            }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute text-lg"
          >
            🪙
          </motion.span>
        ))}
      </div>
    </AnimatePresence>
  );
}
