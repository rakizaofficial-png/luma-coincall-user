"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, Eye, Phone, Radio, Star, Video } from "lucide-react";
import type { DiscoverHost } from "@/lib/discoverHosts";

type Mode = "call" | "watch";

/** Full portrait card for Live / Calling grids */
export function HostGridCard({
  host,
  mode,
  index = 0,
}: {
  host: DiscoverHost;
  mode: Mode;
  index?: number;
}) {
  const href =
    mode === "watch"
      ? `/live/${host.id}`
      : `/call/${host.id}${host.source === "live" ? "?live=1" : ""}`;

  const busy = mode === "call" && host.onCall;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link
        href={busy ? "/call" : href}
        className={`group relative block overflow-hidden rounded-[1.35rem] border border-line bg-ink-2 ${
          busy ? "pointer-events-none opacity-70" : ""
        }`}
      >
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={host.avatarUrl}
            alt={host.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 430px) 50vw, 200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />

          <div className="absolute left-2 top-2 flex flex-wrap items-center gap-1">
            {mode === "watch" || host.live ? (
              <span className="live-pulse flex items-center gap-1 rounded-full bg-coral px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                <Radio className="h-3 w-3" /> Live
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-teal/90 px-2 py-0.5 text-[9px] font-bold uppercase text-ink">
                <span className="online-pulse h-1.5 w-1.5 rounded-full bg-ink" />
                {busy ? "Busy" : "Online"}
              </span>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="flex items-center gap-1 font-display text-sm font-extrabold text-white">
              {host.name}
              {host.verified ? (
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-cyan" />
              ) : null}
            </p>
            <p className="mt-0.5 text-[10px] text-white/70">
              {host.flag} {host.country} · ⭐ {host.rating.toFixed(1)}
            </p>
            <p className="mt-0.5 text-[10px] font-bold text-gold">
              {host.callRate} coins/min
            </p>
            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                mode === "watch"
                  ? "bg-coral text-white"
                  : busy
                    ? "bg-white/15 text-white/70"
                    : "bg-sand text-ink"
              }`}
            >
              {mode === "watch" ? (
                <>
                  <Eye className="h-3 w-3" /> Watch
                </>
              ) : busy ? (
                "On call"
              ) : (
                <>
                  <Video className="h-3 w-3" /> Call
                </>
              )}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function HostGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="aspect-[3/4] animate-pulse rounded-[1.35rem] bg-ink-3"
        />
      ))}
    </div>
  );
}

/** Horizontal compact card (home rails) */
export function PremiumHostCard({
  host,
  compact,
  mode = "call",
}: {
  host: DiscoverHost;
  compact?: boolean;
  mode?: Mode;
}) {
  if (compact) {
    const href =
      mode === "watch" || host.live
        ? `/live/${host.id}`
        : `/call/${host.id}${host.source === "live" ? "?live=1" : ""}`;
    return (
      <Link
        href={href}
        className="glass-card relative flex w-[148px] shrink-0 flex-col overflow-hidden rounded-2xl"
      >
        <div className="relative h-[168px] w-full">
          <Image
            src={host.avatarUrl}
            alt={host.name}
            fill
            className="object-cover"
            sizes="148px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
          {(host.online || host.live) && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-cyan backdrop-blur">
              <span className="online-pulse h-1.5 w-1.5 rounded-full bg-cyan" />
              {host.live ? "Live" : "Online"}
            </span>
          )}
          <div className="absolute bottom-2 left-2 right-2">
            <p className="flex items-center gap-1 font-display text-sm font-bold text-sand">
              {host.name}
              {host.verified ? (
                <BadgeCheck className="h-3.5 w-3.5 text-cyan" />
              ) : null}
            </p>
            <p className="text-[10px] text-muted">
              {host.flag} {host.country} · {host.callRate}/min
            </p>
          </div>
        </div>
      </Link>
    );
  }

  const href = `/call/${host.id}${host.source === "live" ? "?live=1" : ""}`;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card flex gap-3 rounded-2xl p-3"
    >
      <div className="relative h-[72px] w-[72px] shrink-0">
        <Image
          src={host.avatarUrl}
          alt={host.name}
          width={72}
          height={72}
          className="h-[72px] w-[72px] rounded-full object-cover ring-2 ring-white/10"
        />
        {(host.online || host.live) && (
          <span
            className={`online-pulse absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-ink ${
              host.live ? "bg-coral" : host.onCall ? "bg-gold" : "bg-teal"
            }`}
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="flex items-center gap-1 font-display text-[15px] font-bold">
              {host.name}
              {host.verified ? (
                <BadgeCheck className="h-4 w-4 text-cyan" />
              ) : null}
            </p>
            <p className="mt-0.5 text-[11px] text-muted">
              {host.flag} {host.country} · {host.language}
            </p>
          </div>
          <span className="rounded-full bg-ink-3 px-2 py-0.5 text-[10px] font-bold text-gold">
            {host.callRate} 🪙/min
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted">
          <span className="inline-flex items-center gap-0.5 text-sand">
            <Star className="h-3 w-3 fill-gold text-gold" />
            {host.rating.toFixed(1)}
          </span>
          {host.live ? (
            <span className="rounded-full bg-coral/20 px-1.5 py-0.5 font-bold text-coral">
              LIVE
            </span>
          ) : host.online ? (
            <span className="rounded-full bg-teal/15 px-1.5 py-0.5 font-bold text-teal">
              Online
            </span>
          ) : null}
        </div>
        <Link
          href={href}
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-coral px-3.5 py-1.5 text-[11px] font-bold text-white"
        >
          <Phone className="h-3.5 w-3.5" />
          Instant Call
        </Link>
      </div>
    </motion.article>
  );
}
