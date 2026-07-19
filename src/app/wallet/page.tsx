"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Coins tab converted to Profile — keep /wallet working via redirect */
export default function WalletRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/profile");
  }, [router]);
  return (
    <main className="flex min-h-dvh items-center justify-center text-sm text-muted">
      Opening Profile…
    </main>
  );
}
