"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck,
  Users,
  MessageSquare,
  Clock,
  Truck,
  Lock,
  BadgeCheck,
  BookOpen,
  ShieldAlert,
  ClipboardCheck,
  Handshake,
  TrendingDown,
  Package,
  Search,
  EyeOff,
  Landmark,
  Layers,
} from "lucide-react";
import { Eyebrow, SectionShell } from "./ui";

/**
 * Worries — same *concept* as the reference word cloud (all concerns
 * visible at once; 3–4 highlighted at any moment; rotates on a timer)
 * but a different visual language. Instead of scattered variable-sized
 * colored text, every concern is a uniform pill chip. The rotation
 * "pops" the highlighted subset — they fill in with accent, lift up
 * off the surface, and cast a soft ocean-cyan glow — while the rest
 * sit as clean, muted outlines.
 *
 * Honors `prefers-reduced-motion` by locking every chip highlighted
 * with no cycle.
 */

interface Concern {
  text: string;
  icon: LucideIcon;
}

const concerns: Concern[] = [
  { text: "Inconsistent product quality", icon: ShieldCheck },
  { text: "Cultural barriers", icon: Users },
  { text: "Communication breakdowns", icon: MessageSquare },
  { text: "Managing lead times", icon: Clock },
  { text: "Complex logistics", icon: Truck },
  { text: "Your intellectual property rights", icon: Lock },
  { text: "Legitimacy of potential suppliers", icon: BadgeCheck },
  { text: "Ever-changing regulations", icon: BookOpen },
  { text: "Fraudulent suppliers", icon: ShieldAlert },
  { text: "Quality control processes", icon: ClipboardCheck },
  { text: "Negotiating payment terms", icon: Handshake },
  { text: "Optimising cost-efficiency", icon: TrendingDown },
  { text: "Product sampling & development", icon: Package },
  { text: "Finding reliable suppliers", icon: Search },
  { text: "Hidden costs", icon: EyeOff },
  { text: "Customs & compliance", icon: Landmark },
  { text: "MOQ — minimum order quantity", icon: Layers },
];

const HIGHLIGHT_MIN = 3;
const HIGHLIGHT_MAX = 4;
const CYCLE_MS = 2000;

const easeExpo = [0.22, 1, 0.36, 1] as const;

function pickRandom(count: number, poolSize: number, exclude?: Set<number>) {
  const pool: number[] = [];
  for (let i = 0; i < poolSize; i++) if (!exclude?.has(i)) pool.push(i);
  const result: number[] = [];
  for (let k = 0; k < count && pool.length; k++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return result;
}

export function Worries() {
  const rootRef = useRef<HTMLElement>(null);
  const lightOverlayRef = useRef<HTMLDivElement>(null);
  // Deterministic SSR paint → no hydration flash.
  const [highlighted, setHighlighted] = useState<Set<number>>(
    () => new Set([1, 5, 8, 14]),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setHighlighted(new Set(concerns.map((_, i) => i)));
      return;
    }

    const tick = () => {
      setHighlighted((prev) => {
        const count =
          HIGHLIGHT_MIN +
          Math.floor(Math.random() * (HIGHLIGHT_MAX - HIGHLIGHT_MIN + 1));
        return new Set(pickRandom(count, concerns.length, prev));
      });
    };
    const id = window.setInterval(tick, CYCLE_MS);
    return () => window.clearInterval(id);
  }, []);

  // Desktop behaviors:
  //   1. Light overlay dissolves 1 → 0 as the section climbs into view,
  //      smoothing the seam from IntroStatement's light bottom to
  //      Worries' dark navy top.
  //   2. Pin at "top top" for one viewport of scroll — holds the section
  //      long enough for ~5 highlight cycles.
  // Both are desktop-only; mobile scrolls normally. Honors reduced-motion.
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
          end: "+=100%",
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

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative w-full dark-section overflow-hidden min-h-screen"
      style={{ backgroundColor: "#000000" }}
    >
      {/* Two very soft accent-tinted radial washes — enough atmospheric
          depth that the surface doesn't read as a flat black slab, but
          nowhere near a full gradient. Reads as a dark editorial band. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 18% 22%, rgba(77,143,240,0.14) 0%, rgba(77,143,240,0) 65%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 82% 78%, rgba(127,179,245,0.10) 0%, rgba(127,179,245,0) 65%)",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute h-[340px] w-[340px] rounded-full"
        style={{
          top: "45%",
          right: "18%",
          background:
            "radial-gradient(circle, rgba(77,143,240,0.14) 0%, rgba(77,143,240,0) 65%)",
          filter: "blur(20px)",
        }}
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -15, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Faint dot grid — printed-paper texture on the dark surface. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Light overlay — starts white (matching the light IntroStatement
          above) and dissolves to reveal the black section as it climbs
          into view. Bridges the light → dark handoff. */}
      <div
        ref={lightOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40 bg-[#ffffff]"
      />

      <SectionShell
        className="relative pt-20 sm:pt-24 pb-20 sm:pb-24"
        data-nav-theme="dark"
      >
        {/* Intro — sits on black, so text is ivory-on-dark */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: easeExpo }}
          className="mx-auto max-w-[900px] text-center"
        >
          {/* Trust badge — glass pill with animated accent dot */}
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <span className="relative flex h-2 w-2">
              <span
                aria-hidden="true"
                className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping"
              />
              <span
                aria-hidden="true"
                className="relative inline-flex rounded-full h-2 w-2 bg-accent"
              />
            </span>
            Sound familiar?
          </span>
          <h2 className="serif font-black mt-5 text-[clamp(30px,3.8vw,56px)] leading-[1.05] tracking-[-0.025em] text-ivory-on-dark text-balance">
            Common Challenges{" "}
            <span className="serif-italic text-accent font-black whitespace-nowrap">
              we Solve.
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] text-muted-on-dark leading-relaxed text-pretty max-w-[640px] mx-auto">
            Every shipment carries the same recurring anxieties.
            That&rsquo;s exactly the weight we take off your desk.
          </p>
        </motion.div>

        {/* Chip cloud — glass base with layered depth; active pops with
            gradient fill, inner shine, dual-shadow (deep navy + cyan
            glow), and an accent icon square. Each chip has a subtle
            continuous float (different offsets so it doesn't feel
            uniform). */}
        <div
          aria-label="Common trade concerns"
          className="relative mt-12 sm:mt-14 mx-auto max-w-[1100px] flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 px-4"
        >
          {concerns.map((c, i) => {
            const on = highlighted.has(i);
            const Icon = c.icon;
            return (
              <motion.span
                key={c.text}
                animate={{
                  y: on ? -4 : 0,
                  scale: on ? 1.05 : 1,
                }}
                transition={{ duration: 0.55, ease: easeExpo }}
                style={{
                  boxShadow: on
                    ? [
                        // white inner shine — feels like a thin lit edge
                        "inset 0 1px 0 rgba(255,255,255,0.85)",
                        "inset 0 -1px 0 rgba(77,143,240,0.15)",
                        // depth — deep navy drop from the light source
                        "0 16px 40px -14px rgba(4,20,60,0.55)",
                        // brand halo — soft sky-blue glow
                        "0 6px 22px -6px rgba(77,143,240,0.55)",
                      ].join(", ")
                    : [
                        // subtle top-lit edge on the glass
                        "inset 0 1px 0 rgba(255,255,255,0.18)",
                        // gentle ground shadow
                        "0 4px 14px -6px rgba(4,20,60,0.25)",
                      ].join(", "),
                  background: on
                    ? "linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 100%)",
                  borderColor: on ? "#ffffff" : "rgba(255,255,255,0.28)",
                  transformOrigin: "center",
                  backdropFilter: on ? "none" : "blur(8px)",
                }}
                className={`group inline-flex items-center gap-2 rounded-full border pl-1.5 pr-4 py-1.5 text-[13px] sm:text-[14px] font-medium leading-none transition-colors duration-500 ${
                  on ? "text-accent" : "text-white/85"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="grid place-items-center h-6 w-6 rounded-full transition-all duration-500"
                  style={{
                    background: on
                      ? "linear-gradient(180deg, rgba(77,143,240,0.14), rgba(77,143,240,0.06))"
                      : "rgba(255,255,255,0.1)",
                    boxShadow: on
                      ? "inset 0 0 0 1px rgba(77,143,240,0.35)"
                      : "inset 0 0 0 1px rgba(255,255,255,0.18)",
                  }}
                >
                  <Icon
                    className={`h-3.5 w-3.5 transition-colors duration-500 ${
                      on ? "text-accent" : "text-white/70"
                    }`}
                    strokeWidth={2}
                  />
                </span>
                {c.text}
              </motion.span>
            );
          })}
        </div>

        {/* Bottom stat strip — glass card with three quiet credentials
            that reinforce the "we've seen this before" trust beat. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: easeExpo, delay: 0.2 }}
          className="relative mt-14 sm:mt-16 mx-auto max-w-[900px] px-4"
        >
          <div
            className="rounded-2xl border border-white/20 px-6 sm:px-8 py-5 sm:py-6 grid grid-cols-3 gap-4 sm:gap-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.2), 0 12px 32px -12px rgba(4,20,60,0.35)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex flex-col gap-1 border-r border-white/15 pr-4 sm:pr-6">
              <span className="serif serif-italic font-black text-[clamp(28px,3.2vw,44px)] leading-none text-white">
                17
              </span>
              <span className="label text-white/70 text-[10px]">
                Concerns tracked
              </span>
            </div>
            <div className="flex flex-col gap-1 border-r border-white/15 pr-4 sm:pr-6">
              <span className="serif serif-italic font-black text-[clamp(28px,3.2vw,44px)] leading-none text-white">
                25y
              </span>
              <span className="label text-white/70 text-[10px]">
                Handling them
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="serif serif-italic font-black text-[clamp(28px,3.2vw,44px)] leading-none text-white">
                01
              </span>
              <span className="label text-white/70 text-[10px]">
                Accountable desk
              </span>
            </div>
          </div>
        </motion.div>
      </SectionShell>
    </section>
  );
}
