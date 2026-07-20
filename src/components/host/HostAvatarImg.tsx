"use client";

import { useEffect, useState } from "react";
import { defaultHostAvatar } from "@/lib/hostAvatar";

type Props = {
  src?: string | null;
  hostId?: string;
  name?: string;
  alt?: string;
  className?: string;
  /** fill parent with absolute positioning */
  fill?: boolean;
};

/**
 * Host photos come from many domains (API avatar store, Firebase, ui-avatars).
 * Plain <img> avoids Next/Image remotePatterns failures that show a blue ?.
 */
export function HostAvatarImg({
  src,
  hostId,
  name,
  alt,
  className,
  fill,
}: Props) {
  const fallback = defaultHostAvatar(hostId || "host", name);
  const [current, setCurrent] = useState(src || fallback);

  useEffect(() => {
    setCurrent(src || fallback);
  }, [src, fallback]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current || fallback}
      alt={alt || name || "Host"}
      className={
        fill
          ? `absolute inset-0 h-full w-full object-cover ${className || ""}`
          : className
      }
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
