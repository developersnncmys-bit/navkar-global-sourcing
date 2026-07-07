"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Worries — "The Kinetic Ledger".
 *
 * A magazine-style rotating case file where each shipment anxiety is
 * shown as a chapter. The active concern owns the stage: massive
 * chapter numeral watermark behind everything, an asymmetric editorial
 * split for the question and the answer, a circular auto-cycle
 * progress arc, and a horizontal chapter deck at the bottom that
 * doubles as navigation. Ocean-palette accents throughout.
 */

type Concern = {
  category: string;
  voice: string;
  response: string;
};

const concerns: Concern[] = [
  {
    category: "Quality integrity",
    voice: "What if the batch doesn't match the sample?",
    response:
      "We sample at every stage — pilot, first-off, mid-run and pre-shipment. Nothing ships that our floor hasn't touched.",
  },
  {
    category: "Supplier trust",
    voice: "What if my supplier turns out not to exist?",
    response:
      "500+ factories vetted on the ground before contract. If the address isn't real, we know before you sign.",
  },
  {
    category: "Communication",
    voice: "What if we simply can't understand each other?",
    response:
      "Mandarin-speaking desk staff on our side, English on yours — same team, same accountability.",
  },
  {
    category: "Lead times",
    voice: "What if the season is over by the time it arrives?",
    response:
      "Production calendar shadowed weekly. Freight index tracked before rate lock. You know your ETA in weeks, not wishes.",
  },
  {
    category: "IP protection",
    voice: "What if my design walks out the factory door?",
    response:
      "IP filings before samples leave the desk. NDAs on the floor. Owner-of-record checks at customs on the way in.",
  },
  {
    category: "Regulations",
    voice: "What if the rules change after we've already shipped?",
    response:
      "DGFT, customs and PGA conditions read weekly. If a notification affects your consignment, we flag it before it lands.",
  },
  {
    category: "Fraud",
    voice: "What if we get a fake certificate for a real invoice?",
    response:
      "Test-house reports verified at source. Assay checks for jewellery. Material certs cross-referenced with the mill of origin.",
  },
  {
    category: "Cost transparency",
    voice: "What if the real cost is hiding in a line item I can't see?",
    response:
      "FOB / CIF / DAP quoted transparently. Every deduction, demurrage risk and MOQ premium visible before you sign.",
  },
  {
    category: "MOQ",
    voice: "What if the order size doesn't work for our shelf?",
    response:
      "MOQ splits negotiated on your behalf. Multi-SKU consolidation across our factory bench so you buy the mix you need.",
  },
  {
    category: "Customs & compliance",
    voice: "What if the paperwork trips us at the port?",
    response:
      "In-house compliance desk. HS classification, BIS, FSSAI, APEDA — filed before the container leaves the yard.",
  },
  {
    category: "Logistics",
    voice: "What if the shipment gets lost between hands?",
    response:
      "Single accountable desk from supplier search to ship's deck. One point of contact, one thread, one owner.",
  },
];

const CYCLE_MS = 6200;
const easeExpo = [0.22, 1, 0.36, 1] as const;

// Ocean-family accent per concern index — cycles through 4 tints so
// each chapter has a subtle color signature.
const chapterTints = [
  "#3ab8bd",
  "#5ec9ce",
  "#169095",
  "#7fd8be",
];

export function Worries() {
  const rootRef = useRef<HTMLElement>(null);
  const lightOverlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Force play the background video after mount — some browsers block
  // programmatic autoplay unless we call `.play()` explicitly with the
  // element already muted + playsInline. Swallow the rejection so it
  // doesn't throw when a user policy blocks it.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % concerns.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [isPaused]);

  const goTo = (i: number) => {
    setActiveIdx(((i % concerns.length) + concerns.length) % concerns.length);
    setIsPaused(true);
    window.setTimeout(() => setIsPaused(false), 9000);
  };

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(lightOverlayRef.current, { opacity: 0 });
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.set(lightOverlayRef.current, { opacity: 1 });
        const fade = gsap.fromTo(
          lightOverlayRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 35%",
              end: "top top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
        const pin = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        });
        return () => {
          fade.scrollTrigger?.kill();
          pin.kill();
        };
      });
      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  const active = concerns[activeIdx];
  const total = concerns.length;
  const tint = chapterTints[activeIdx % chapterTints.length];

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative w-full overflow-hidden min-h-screen"
      style={{ backgroundColor: "#0a1f1e" }}
    >
      {/* --- Background video — the "commom challenges.mp4" file
          (note the typo in the actual filename on disk). Autoplay
          works because it's muted + playsInline. z-0 so overlays
          and content sit above. Two <source> entries cover both the
          URL-encoded and literal-space variants of the filename so
          whichever the dev server serves will match. --- */}
      <video
        ref={videoRef}
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/hero/commom%20challenges.mp4" type="video/mp4" />
        <source src="/hero/commom challenges.mp4" type="video/mp4" />
      </video>

      {/* Depth overlay — darkens the video so the foreground editorial
          content stays legible. Lightened opacity so the footage is
          clearly visible rather than crushed to near-black. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,31,30,0.55) 0%, rgba(10,31,30,0.35) 45%, rgba(10,31,30,0.7) 100%)",
        }}
      />

      {/* Slow-drifting glow that trails the active chapter tint —
          layered above the video for a subtle chromatic mood shift. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute h-[60vh] w-[60vh] rounded-full z-[2]"
        style={{
          top: "20%",
          right: "10%",
          background: `radial-gradient(circle, ${tint}20 0%, transparent 65%)`,
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Light overlay — bridges the IntroStatement seam. */}
      <div
        ref={lightOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50 bg-white"
      />

      <div className="relative w-full min-h-screen flex flex-col">
        {/* -------- Top row — eyebrow + status meta -------- */}
        <div className="relative z-20 flex items-start justify-between gap-6 px-6 sm:px-10 lg:px-14 pt-16 sm:pt-20">
          <div>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-sm px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.22em] uppercase text-white/80">
              <span className="relative flex h-2 w-2">
                <span
                  aria-hidden="true"
                  className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                  style={{ background: tint }}
                />
                <span
                  aria-hidden="true"
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: tint }}
                />
              </span>
              Sound familiar?
            </span>
            <h2 className="serif font-black mt-4 text-[clamp(26px,3vw,42px)] leading-[0.98] tracking-[-0.025em] text-white text-balance uppercase">
              Common challenges,{" "}
              <span className="serif-italic" style={{ color: tint }}>
                we solve.
              </span>
            </h2>
          </div>

          {/* Simple mono counter, right side. Replaces the earlier
              circular progress ring — quieter, no competing focal point. */}
          <div className="hidden md:flex items-center gap-3 mt-2">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/50">
              {isPaused ? "Paused" : "Auto-cycling"}
            </span>
            <span
              className="font-mono text-[13px] tabular-nums text-white/85"
              aria-live="polite"
            >
              {String(activeIdx + 1).padStart(2, "0")}
              <span className="text-white/40 mx-1">/</span>
              {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* -------- Main stage -------- */}
        <div className="relative flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-14 pt-8 sm:pt-14 pb-6 sm:pb-8">
          {/* Content grid, foreground layer. */}
          <div className="relative z-10 w-full max-w-[1280px] grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-center">
            {/* --- LEFT: category badge + huge quoted question --- */}
            <div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`cat-${activeIdx}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: easeExpo }}
                  className="flex items-center gap-3"
                >
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.22em] uppercase"
                    style={{
                      background: `${tint}18`,
                      color: tint,
                      border: `1px solid ${tint}40`,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{ background: tint }}
                    />
                    Chapter {String(activeIdx + 1).padStart(2, "0")} · {active.category}
                  </span>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 sm:mt-8 min-h-[240px] sm:min-h-[300px] lg:min-h-[360px] relative">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h3
                    key={`voice-${activeIdx}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.7, ease: easeExpo }}
                    className="relative serif font-black text-white tracking-[-0.03em] text-balance"
                    style={{
                      fontSize: "clamp(26px, 3.4vw, 54px)",
                      lineHeight: 1.05,
                    }}
                  >
                    {active.voice}
                  </motion.h3>
                </AnimatePresence>
              </div>
            </div>

            {/* --- RIGHT: answer panel with animated hairline connector --- */}
            <div className="relative">
              {/* Animated hairline that grows into the answer panel. */}
              <motion.div
                key={`line-${activeIdx}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease: easeExpo, delay: 0.1 }}
                className="h-px w-full mb-6 origin-left"
                style={{ background: `linear-gradient(90deg, ${tint} 0%, ${tint}30 100%)` }}
              />

              <div className="flex items-center gap-2 mb-4">
                <span
                  aria-hidden="true"
                  className="block h-2 w-2 rounded-full"
                  style={{ background: tint }}
                />
                <span
                  className="font-mono text-[10px] tracking-[0.22em] uppercase"
                  style={{ color: tint }}
                >
                  Our answer
                </span>
              </div>

              <div className="min-h-[130px] sm:min-h-[160px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={`resp-${activeIdx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6, ease: easeExpo, delay: 0.15 }}
                    className="serif text-white/90 leading-[1.4] text-pretty"
                    style={{ fontSize: "clamp(17px, 1.4vw, 22px)" }}
                  >
                    {active.response}
                  </motion.p>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>

        {/* -------- Minimal footer: prev/next + progress hairline -------- */}
        <div className="relative z-20 px-6 sm:px-10 lg:px-14 pb-8 sm:pb-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => goTo(activeIdx - 1)}
              aria-label="Previous concern"
              className="grid place-items-center h-9 w-9 rounded-full border border-white/15 text-white/85 hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => goTo(activeIdx + 1)}
              aria-label="Next concern"
              className="grid place-items-center h-9 w-9 rounded-full border border-white/15 text-white/85 hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>

            {/* Progress hairline that fills across the CYCLE_MS interval. */}
            <div className="relative flex-1 ml-3 h-[2px] bg-white/10 overflow-hidden rounded-full">
              <motion.span
                key={`progress-${activeIdx}-${isPaused}`}
                initial={{ width: "0%" }}
                animate={{ width: isPaused ? "0%" : "100%" }}
                transition={{
                  duration: isPaused ? 0.25 : CYCLE_MS / 1000,
                  ease: "linear",
                }}
                className="absolute inset-y-0 left-0 block"
                style={{ background: tint }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

