"use client";

import { useLayoutEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Forces every page load — including hard reloads — to land at the very
 * top of the hero. Runs in `useLayoutEffect` so it fires before paint,
 * covering the timing window in which browsers might otherwise restore
 * a stale scroll position from bfcache.
 *
 * After scrolling, refreshes GSAP ScrollTrigger so any pinned/scrubbed
 * sections recompute from scrollY = 0 instead of from whatever stale
 * position they may have grabbed during the initial mount.
 */
export function ScrollToTopOnLoad() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const pinToTop = () => {
      window.scrollTo(0, 0);
      // Let GSAP re-measure pin positions, trigger offsets, etc. now
      // that scrollY is guaranteed to be 0.
      ScrollTrigger.refresh();
    };

    // Mount-time pass.
    pinToTop();

    // `load` event — covers Safari / iOS, which sometimes restore
    // scroll AFTER React has mounted.
    if (document.readyState !== "complete") {
      window.addEventListener("load", pinToTop, { once: true });
      return () => window.removeEventListener("load", pinToTop);
    }

    // One more pass on the next animation frame to catch any
    // late layout shifts that nudged the scroll position.
    const raf = requestAnimationFrame(pinToTop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
