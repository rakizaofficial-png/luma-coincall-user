"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Radio, Video, MessageCircle, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { getTotalUnread, subscribeUnread } from "@/lib/dmStore";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/call", label: "Calling", icon: Video },
  { href: "/messages", label: "Chat", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  // Reactive chat unread badge — refreshes on send/read/incoming and on
  // navigation (so the badge clears right after a chat is opened/read).
  useEffect(() => {
    const refresh = () => setUnread(getTotalUnread());
    refresh();
    return subscribeUnread(refresh);
  }, []);
  useEffect(() => {
    setUnread(getTotalUnread());
  }, [pathname]);

  const hide =
    pathname.startsWith("/live/") ||
    pathname.startsWith("/call/") ||
    pathname.startsWith("/host/") ||
    pathname === "/match" ||
    pathname.startsWith("/messages/") ||
    pathname.startsWith("/party/") ||
    pathname.startsWith("/feed") ||
    pathname === "/premium" ||
    pathname === "/support";

  if (hide) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-line bg-ink/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <ul className="grid grid-cols-5 gap-1 py-2">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : tab.href === "/profile"
                ? pathname.startsWith("/profile") ||
                  pathname.startsWith("/wallet") ||
                  pathname.startsWith("/rewards")
                : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className="relative flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium"
              >
                {active && (
                  <motion.span
                    layoutId="nav-glow"
                    className="absolute inset-0 rounded-2xl bg-coral/15"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">
                  <Icon
                    className={`h-5 w-5 ${active ? "text-coral" : "text-muted"}`}
                    strokeWidth={active ? 2.4 : 1.8}
                  />
                  {tab.href === "/messages" && unread > 0 ? (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[9px] font-bold leading-none text-white ring-2 ring-ink">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                </span>
                <span
                  className={
                    active ? "relative text-sand" : "relative text-muted"
                  }
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
