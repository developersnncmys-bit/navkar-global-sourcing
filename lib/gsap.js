"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger exactly once on the client.
if (typeof window !== "undefined" && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  // Lenis (if/when added) should call gsap.ticker.add(...) and lagSmoothing(0)
  // from its setup; we set lagSmoothing here defensively so scrub stays smooth.
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger };
