"use client";

import { motion } from "framer-motion";

export function CallWaveform({ active }: { active: boolean }) {
  const bars = [0, 1, 2, 3, 4, 5, 6];
  return (
    <div className="flex h-10 items-end justify-center gap-1">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-coral to-cyan"
          animate={
            active
              ? {
                  height: [8, 18 + (i % 3) * 8, 10, 22, 8],
                }
              : { height: 6 }
          }
          transition={
            active
              ? {
                  duration: 0.9 + (i % 4) * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : undefined
          }
          style={{ height: 6 }}
        />
      ))}
    </div>
  );
}
