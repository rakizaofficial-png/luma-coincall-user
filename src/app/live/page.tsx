"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  HostGridCard,
  HostGridSkeleton,
} from "@/components/host/PremiumHostCard";
import { TopBar } from "@/components/TopBar";
import { fetchLiveHosts } from "@/lib/api";
import {
  mergeDiscoverHosts,
  type DiscoverHost,
} from "@/lib/discoverHosts";
import { useApp } from "@/lib/store";

/** Live — card grid of live streaming hosts only */
export default function LivePage() {
  const { completeLiveWatch } = useApp();
  const [hosts, setHosts] = useState<DiscoverHost[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const all = await fetchLiveHosts();
      setHosts(mergeDiscoverHosts(all).filter((h) => h.live));
    } catch {
      setHosts(mergeDiscoverHosts([]).filter((h) => h.live));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const t = setInterval(() => void refresh(), 8000);
    return () => clearInterval(t);
  }, [refresh]);

  useEffect(() => {
    const t = setTimeout(() => completeLiveWatch(), 120_000);
    return () => clearTimeout(t);
  }, [completeLiveWatch]);

  return (
    <main className="pb-28">
      <TopBar title="Live" subtitle="Watch streaming hosts" />

      {loading && !hosts.length ? (
        <HostGridSkeleton />
      ) : hosts.length === 0 ? (
        <div className="mx-4 mt-2 rounded-2xl border border-dashed border-line bg-ink-2/60 px-4 py-10 text-center text-sm text-muted">
          No live streams right now.
          <br />
          <Link href="/call" className="mt-2 inline-block font-bold text-coral">
            Call a host instead →
          </Link>
        </div>
      ) : (
        <section className="mt-2 grid grid-cols-2 gap-3 px-4 pb-8">
          {hosts.map((h, i) => (
            <HostGridCard key={h.id} host={h} mode="watch" index={i} />
          ))}
        </section>
      )}
    </main>
  );
}
