"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, Wallet, Zap } from "lucide-react";
import {
  fetchPublicLibraryVideos,
  pickStreamUrl,
  type PublicLibraryVideo,
} from "@/lib/mediaLibrary";

/**
 * User-facing library preview — fast stream, countdown, Preview badge,
 * continue to live match or recharge.
 */
export function LibraryPreviewPlayer({
  category = "preview",
  countdownSec = 8,
}: {
  category?: string;
  countdownSec?: number;
}) {
  const [videos, setVideos] = useState<PublicLibraryVideo[]>([]);
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(countdownSec);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchPublicLibraryVideos({ category }).then((rows) => {
      if (cancelled) return;
      if (!rows.length) {
        void fetchPublicLibraryVideos().then((all) => {
          if (!cancelled) setVideos(all);
        });
        return;
      }
      setVideos(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [category]);

  const current = videos[index] || null;
  const src = useMemo(
    () => (current ? pickStreamUrl(current) : ""),
    [current],
  );

  useEffect(() => {
    setLeft(countdownSec);
    setPlaying(true);
  }, [index, countdownSec, current?.id]);

  useEffect(() => {
    if (!current || !playing) return;
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setIndex((i) => (videos.length ? (i + 1) % videos.length : 0));
          return countdownSec;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [current, playing, videos.length, countdownSec]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !src) return;
    el.load();
    void el.play().catch(() => {
      el.muted = true;
      void el.play().catch(() => undefined);
    });
  }, [src]);

  if (!current) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={current.id}
        className="relative mx-4 overflow-hidden rounded-3xl border border-line bg-ink-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
      >
        <div className="relative aspect-[4/5] max-h-[420px] w-full bg-black">
          {current.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.previewFrameUrl || current.thumbnailUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          ) : null}
          <video
            ref={videoRef}
            src={src}
            poster={current.thumbnailUrl}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            autoPlay
            muted
            loop
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

          <motion.span
            className="absolute left-3 top-3 rounded-full border border-cyan/40 bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan backdrop-blur"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            Preview
          </motion.span>

          <motion.span
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-black/55 px-2.5 py-1 text-[10px] font-bold text-gold backdrop-blur"
            animate={{ opacity: [1, 0.55, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <Play className="h-3 w-3" fill="currentColor" />
            {left}s
          </motion.span>

          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-display text-xl font-extrabold text-white">
              {current.title}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-white/70">
              {current.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {current.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/75"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href="/match"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-coral py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(255,42,122,0.35)]"
              >
                <Zap className="h-4 w-4" /> Live now
              </Link>
              <Link
                href="/wallet"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 py-3 text-sm font-bold text-gold"
              >
                <Wallet className="h-4 w-4" /> Recharge
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="mt-2 w-full py-1 text-center text-[10px] font-semibold text-white/45"
            >
              {playing ? "Pause countdown" : "Resume countdown"} ·{" "}
              <Sparkles className="inline h-3 w-3" /> optimized stream
            </button>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
