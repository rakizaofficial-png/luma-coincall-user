"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  WELCOME_PUSH_CONFIG,
  WELCOME_PUSH_HOST,
  type WelcomePushHost,
  type WelcomePushPhase,
} from "@/lib/welcomePush/config";
import {
  nextLaunchDelayMs,
  nextRepeatDelayMs,
  nextRingDurationMs,
  pickNextWelcomeCaller,
} from "@/lib/welcomePush/rotation";
import {
  startWelcomeRingTone,
  stopWelcomeRingTone,
} from "@/lib/welcomePush/ringtone";
import { pickRandomStatusLine } from "@/lib/welcomePush/uiCopy";

/**
 * Lifecycle:
 * IDLE → pick diversified host → INCOMING_CALL (ringtone)
 *      → Accept → TEASER → PAYWALL → IDLE (schedule randomized next)
 *      → Reject / timeout → IDLE (schedule randomized next)
 *
 * Never reuses the same host/message within the cooldown window.
 */
export function useWelcomePushCall(opts: { enabled: boolean }) {
  const [phase, setPhase] = useState<WelcomePushPhase>("IDLE");
  const [host, setHost] = useState<WelcomePushHost>(WELCOME_PUSH_HOST);
  const [statusLine, setStatusLine] = useState("Ringing…");
  const [offerLeft, setOfferLeft] = useState<number>(
    WELCOME_PUSH_CONFIG.offerSeconds,
  );
  const teaserTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const offerTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const ringTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef<WelcomePushPhase>("IDLE");
  const pickingRef = useRef(false);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const clearTimers = useCallback(() => {
    if (teaserTimer.current) {
      clearTimeout(teaserTimer.current);
      teaserTimer.current = null;
    }
    if (offerTimer.current) {
      clearInterval(offerTimer.current);
      offerTimer.current = null;
    }
    if (ringTimer.current) {
      clearTimeout(ringTimer.current);
      ringTimer.current = null;
    }
    stopWelcomeRingTone();
  }, []);

  const triggerIncoming = useCallback(async () => {
    if (!opts.enabled) return;
    if (phaseRef.current !== "IDLE" && phaseRef.current !== "DONE") return;
    if (pickingRef.current) return;
    pickingRef.current = true;
    try {
      const next = await pickNextWelcomeCaller();
      // Prefer admin library teaser when available (additive)
      try {
        const { resolveLibraryTeaserUrl } = await import(
          "@/lib/welcomePush/libraryTeaser"
        );
        const teaser = await resolveLibraryTeaserUrl();
        if (teaser) next.teaser_video_url = teaser;
      } catch {
        /* keep host teaser */
      }
      if (!opts.enabled) return;
      if (phaseRef.current !== "IDLE" && phaseRef.current !== "DONE") return;
      setHost(next);
      setStatusLine(pickRandomStatusLine());
      setPhase("INCOMING_CALL");
      startWelcomeRingTone();
    } catch {
      /* stay idle; will retry on next schedule */
    } finally {
      pickingRef.current = false;
    }
  }, [opts.enabled]);

  const scheduleNext = useCallback(
    (delayMs: number) => {
      if (repeatTimer.current) clearTimeout(repeatTimer.current);
      repeatTimer.current = setTimeout(() => {
        void triggerIncoming();
      }, delayMs);
    },
    [triggerIncoming],
  );

  // First call + recurring while on home (randomized delays)
  useEffect(() => {
    if (!opts.enabled) {
      clearTimers();
      if (repeatTimer.current) clearTimeout(repeatTimer.current);
      setPhase("IDLE");
      return;
    }
    scheduleNext(nextLaunchDelayMs());
    return () => {
      clearTimers();
      if (repeatTimer.current) clearTimeout(repeatTimer.current);
    };
  }, [opts.enabled, clearTimers, scheduleNext]);

  // Ringtone + auto-dismiss (randomized ring window)
  useEffect(() => {
    if (phase !== "INCOMING_CALL") {
      stopWelcomeRingTone();
      if (ringTimer.current) {
        clearTimeout(ringTimer.current);
        ringTimer.current = null;
      }
      return;
    }
    startWelcomeRingTone();
    const ringMs = nextRingDurationMs();
    ringTimer.current = setTimeout(() => {
      stopWelcomeRingTone();
      setPhase("IDLE");
      scheduleNext(nextRepeatDelayMs());
    }, ringMs);
    return () => {
      stopWelcomeRingTone();
      if (ringTimer.current) {
        clearTimeout(ringTimer.current);
        ringTimer.current = null;
      }
    };
  }, [phase, scheduleNext]);

  // Paywall FOMO countdown
  useEffect(() => {
    if (phase !== "PAYWALL_BOOST") return;
    setOfferLeft(WELCOME_PUSH_CONFIG.offerSeconds);
    offerTimer.current = setInterval(() => {
      setOfferLeft((s) => {
        if (s <= 1) {
          if (offerTimer.current) clearInterval(offerTimer.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (offerTimer.current) clearInterval(offerTimer.current);
    };
  }, [phase]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const rejectIncoming = useCallback(() => {
    stopWelcomeRingTone();
    setPhase("IDLE");
    scheduleNext(nextRepeatDelayMs());
  }, [scheduleNext]);

  const acceptIncoming = useCallback(() => {
    stopWelcomeRingTone();
    if (ringTimer.current) {
      clearTimeout(ringTimer.current);
      ringTimer.current = null;
    }
    setPhase("TEASER_PLAYING");
    teaserTimer.current = setTimeout(() => {
      setPhase("PAYWALL_BOOST");
    }, WELCOME_PUSH_CONFIG.teaserCutMs);
  }, []);

  const closePaywall = useCallback(() => {
    clearTimers();
    setPhase("IDLE");
    scheduleNext(nextRepeatDelayMs());
  }, [clearTimers, scheduleNext]);

  const hardDisconnectTeaser = useCallback(() => {
    if (teaserTimer.current) clearTimeout(teaserTimer.current);
    setPhase("PAYWALL_BOOST");
  }, []);

  return {
    phase,
    host,
    statusLine,
    offerLeft,
    acceptIncoming,
    rejectIncoming,
    closePaywall,
    hardDisconnectTeaser,
  };
}
