"use client";

import { useEffect, useRef } from "react";

interface DigestTrackerProps {
  digestId: string;
  email: string | null;
}

export default function DigestTracker({ digestId, email }: DigestTrackerProps) {
  const sessionRef = useRef<string | null>(null);
  const startRef = useRef(Date.now());
  const maxScrollRef = useRef(0);

  useEffect(() => {
    const sessionId = crypto.randomUUID();
    sessionRef.current = sessionId;
    startRef.current = Date.now();

    function getTimeOnPage() {
      return Math.round((Date.now() - startRef.current) / 1000);
    }

    function getScrollPercent() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return 100;
      const pct = (scrollTop / docHeight) * 100;
      // Round to nearest milestone
      if (pct >= 95) return 100;
      if (pct >= 75) return 75;
      if (pct >= 50) return 50;
      if (pct >= 25) return 25;
      return 0;
    }

    function sendBeacon() {
      const payload = JSON.stringify({
        sessionId,
        digestId,
        email,
        timeOnPage: getTimeOnPage(),
        maxScroll: maxScrollRef.current,
      });
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/track/digest-view", blob);
    }

    // Track scroll depth
    function onScroll() {
      const current = getScrollPercent();
      if (current > maxScrollRef.current) {
        maxScrollRef.current = current;
      }
    }

    // Initial beacon
    sendBeacon();

    // Periodic beacons every 15 seconds
    const interval = setInterval(sendBeacon, 15000);

    window.addEventListener("scroll", onScroll, { passive: true });

    // Final beacon on leave
    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        sendBeacon();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      sendBeacon();
    };
  }, [digestId, email]);

  return null;
}
