"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Percent, Search, X } from "lucide-react";
import {
  HostGridCard,
  HostGridSkeleton,
} from "@/components/host/PremiumHostCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WalletDiamond } from "@/components/WalletDiamond";
import { fetchLiveHosts } from "@/lib/api";
import {
  filterHosts,
  mergeDiscoverHosts,
  type DiscoverHost,
} from "@/lib/discoverHosts";
import { useApp } from "@/lib/store";

type Tab = "live" | "call";

const DISCOUNT_KEY = "luma_home_discount_dismissed";

/** Clean home — Live + Calling host cards only, plus a small discount popup */
export function HomeScreen() {
  const { freeTrialAvailable } = useApp();
  const [hosts, setHosts] = useState<DiscoverHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("live");
  const [discountOpen, setDiscountOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const live = await fetchLiveHosts();
        if (!cancelled) setHosts(mergeDiscoverHosts(live));
      } catch {
        if (!cancelled) setHosts(mergeDiscoverHosts([]));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISCOUNT_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setDiscountOpen(true), 900);
    return () => clearTimeout(t);
  }, []);

  const dismissDiscount = () => {
    setDiscountOpen(false);
    try {
      sessionStorage.setItem(DISCOUNT_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const filtered = useMemo(
    () => filterHosts(hosts, { query, category: "All" }),
    [hosts, query],
  );
  const liveHosts = useMemo(
    () => filtered.filter((h) => h.live),
    [filtered],
  );
  const callingHosts = useMemo(
    () => filtered.filter((h) => h.online && !h.live),
    [filtered],
  );

  const list = tab === "live" ? liveHosts : callingHosts;

  return (
    <main className="relative pb-28">
      <header className="sticky top-0 z-30 border-b border-line/50 bg-ink/80 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-coral">
              Luma
            </p>
            <h1 className="font-display text-2xl font-extrabold leading-none">
              Discover
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <WalletDiamond />
          </div>
        </div>

        <label className="flex items-center gap-2 rounded-2xl border border-line bg-ink-2/70 px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hosts…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </label>

        <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-ink-2/60 p-1">
          <button
            type="button"
            onClick={() => setTab("live")}
            className={`rounded-xl py-2.5 text-center text-xs font-bold transition ${
              tab === "live"
                ? "bg-coral text-white"
                : "text-muted hover:text-sand"
            }`}
          >
            Live
          </button>
          <button
            type="button"
            onClick={() => setTab("call")}
            className={`rounded-xl py-2.5 text-center text-xs font-bold transition ${
              tab === "call"
                ? "bg-teal text-ink"
                : "text-muted hover:text-sand"
            }`}
          >
            Online
          </button>
        </div>
      </header>

      <div className="mt-4">
        {loading ? (
          <HostGridSkeleton count={6} />
        ) : list.length === 0 ? (
          <div className="mx-4 rounded-2xl border border-dashed border-line px-4 py-12 text-center text-sm text-muted">
            {tab === "live"
              ? "No live hosts right now."
              : "No online hosts for calling."}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setTab(tab === "live" ? "call" : "live")}
                className="text-sm font-bold text-coral"
              >
                Switch to {tab === "live" ? "Online" : "Live"} →
              </button>
            </div>
          </div>
        ) : (
          <section className="grid grid-cols-2 gap-3 px-4 pb-8">
            {list.map((h, i) => (
              <HostGridCard
                key={`${tab}-${h.id}`}
                host={h}
                mode={tab === "live" ? "watch" : "call"}
                index={i}
              />
            ))}
          </section>
        )}
      </div>

      {/* Little discount / promo popup */}
      <AnimatePresence>
        {discountOpen ? (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed bottom-[5.5rem] left-1/2 z-40 w-[min(100%,430px)] -translate-x-1/2 px-4"
          >
            <div className="relative overflow-hidden rounded-2xl border border-gold/35 bg-ink-2/95 p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-4 -top-6 h-20 w-20 rounded-full bg-gold/25 blur-2xl" />
              <button
                type="button"
                onClick={dismissDiscount}
                className="absolute right-2 top-2 rounded-full p-1.5 text-muted hover:bg-ink-3 hover:text-sand"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center gap-3 pr-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold">
                  <Percent className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-bold text-sand">
                    {freeTrialAvailable
                      ? "First call free · 30s"
                      : "Coin pack · +20% bonus"}
                  </p>
                  <p className="text-[11px] text-muted">
                    {freeTrialAvailable
                      ? "Try a host on Match — no coins needed"
                      : "Limited offer on popular packs"}
                  </p>
                </div>
                <Link
                  href={freeTrialAvailable ? "/match" : "/profile"}
                  onClick={dismissDiscount}
                  className="shrink-0 rounded-full bg-gold px-3 py-1.5 text-[11px] font-bold text-ink"
                >
                  Claim
                </Link>
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
