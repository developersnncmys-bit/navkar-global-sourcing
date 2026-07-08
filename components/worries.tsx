"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  MessageSquare,
  Clock,
  Truck,
  Lock,
  BadgeCheck,
  BookOpen,
  AlertTriangle,
  ClipboardCheck,
  Handshake,
  TrendingDown,
  Package,
  Search,
  EyeOff,
  Landmark,
  Layers,
  type LucideIcon,
} from "lucide-react";

/**
 * Worries — "Common Challenges we Solve".
 *
 * Seventeen shipment anxieties displayed as inline editorial keyword
 * items with icon + label (no pill, no chip, no card). A three-word
 * sliding window auto-cycles: active items get an accent underline
 * (same treatment as the hero subtext), the rest recede. Hovering
 * any item pauses the cycle and pins that item as the active start.
 *
 * Preserved from the previous build:
 *   • Background video ("commom challenges.mp4")
 *   • Drifting Zoom-royal ambient glow
 */

type Concern = {
  label: string;      // Neutral category — used in the small tile
  voice: string;      // The anxiety in the buyer's own words — used in the featured block
  response: string;   // Our answer — the emotional payoff
  icon: LucideIcon;
};

// Seventeen concerns — each carries the neutral label (for the wall
// tiles) plus a first-person anxiety and the response we ship. The
// voice/response pair drives the featured block above the wall.
const concerns: Concern[] = [
  {
    label: "Inconsistent product quality",
    voice: "What if the batch doesn't match the sample?",
    response:
      "We sample at every stage — pilot, first-off, mid-run and pre-shipment. Nothing ships that our floor hasn't touched.",
    icon: ShieldCheck,
  },
  {
    label: "Cultural barriers",
    voice: "What if the way we do business just doesn't translate?",
    response:
      "Local teams on both sides of the deal. We bridge the culture gap so decisions don't stall over what didn't get said.",
    icon: Users,
  },
  {
    label: "Communication breakdowns",
    voice: "What if we simply can't understand each other?",
    response:
      "Mandarin-speaking desk staff on our side, English on yours — same team, same accountability.",
    icon: MessageSquare,
  },
  {
    label: "Managing lead times",
    voice: "What if the season is over by the time it arrives?",
    response:
      "Production calendar shadowed weekly. Freight index tracked before rate lock. You know your ETA in weeks, not wishes.",
    icon: Clock,
  },
  {
    label: "Complex logistics",
    voice: "What if the shipment gets lost between hands?",
    response:
      "Single accountable desk from supplier search to ship's deck. One point of contact, one thread, one owner.",
    icon: Truck,
  },
  {
    label: "Your intellectual property rights",
    voice: "What if my design walks out the factory door?",
    response:
      "IP filings before samples leave the desk. NDAs on the floor. Owner-of-record checks at customs on the way in.",
    icon: Lock,
  },
  {
    label: "Legitimacy of potential suppliers",
    voice: "What if my supplier turns out not to exist?",
    response:
      "500+ factories vetted on the ground before contract. If the address isn't real, we know before you sign.",
    icon: BadgeCheck,
  },
  {
    label: "Ever-changing regulations",
    voice: "What if the rules change after we've already shipped?",
    response:
      "DGFT, customs and PGA conditions read weekly. If a notification affects your consignment, we flag it before it lands.",
    icon: BookOpen,
  },
  {
    label: "Fraudulent suppliers",
    voice: "What if we get a fake certificate for a real invoice?",
    response:
      "Test-house reports verified at source. Assay checks for jewellery. Material certs cross-referenced with the mill of origin.",
    icon: AlertTriangle,
  },
  {
    label: "Quality control processes",
    voice: "What if the supplier ghosts us mid-production?",
    response:
      "Every supplier on a live scorecard — delivery, quality, responsiveness tracked continuously. We pull the plug before you find out.",
    icon: ClipboardCheck,
  },
  {
    label: "Negotiating payment terms",
    voice: "What if the payment terms strand us before the goods land?",
    response:
      "LC, TT, escrow — we structure terms that protect the buyer, then negotiate them with suppliers on your behalf.",
    icon: Handshake,
  },
  {
    label: "Optimising cost-efficiency",
    voice: "What if a better factory exists and we're leaving margin on the table?",
    response:
      "Continuous benchmarking across three suppliers per SKU, minimum. Your quote isn't the market price — it's the best available price.",
    icon: TrendingDown,
  },
  {
    label: "Product sampling & development",
    voice: "What if the sample never becomes the product?",
    response:
      "Golden samples sealed and referenced at every production stage. First-off and pre-shipment must match the seal, or nothing ships.",
    icon: Package,
  },
  {
    label: "Finding reliable suppliers",
    voice: "What if we can't tell the real factories from the middlemen?",
    response:
      "Every factory audited by our team on the ground — floor visit, capacity check, owner-of-record. No brokers dressed as makers.",
    icon: Search,
  },
  {
    label: "Hidden costs",
    voice: "What if a surprise charge eats the margin at the port?",
    response:
      "Full landed cost broken out before you sign — no clearance surprise, no demurrage shock, no floating handling fees at the terminal.",
    icon: EyeOff,
  },
  {
    label: "Customs & compliance",
    voice: "What if the paperwork trips us at the port?",
    response:
      "In-house compliance desk. HS classification, BIS, FSSAI, APEDA — filed before the container leaves the yard.",
    icon: Landmark,
  },
  {
    label: "MOQ — minimum order quantity",
    voice: "What if the order size doesn't work for our shelf?",
    response:
      "MOQ splits negotiated on your behalf. Multi-SKU consolidation across our factory bench so you buy the mix you need.",
    icon: Layers,
  },
];

const easeExpo = [0.22, 1, 0.36, 1] as const;
const ACCENT = "#4059B8";
// Cadence for the sliding highlight — how long each 3-word window holds
// before advancing one step.
const SPOTLIGHT_MS = 1800;

export function Worries() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  // Pauses the auto-cycle while the reader is hovering the wall so the
  // interval doesn't shove them off the keyword they're reading.
  const pausedRef = useRef(false);

  // Force play the background video after mount — muted + playsInline
  // is required for programmatic autoplay to succeed.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  // Auto-cycle the three-keyword sliding window. Respects reduced-motion
  // by holding on the first frame.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setActiveIdx((i) => (i + 1) % concerns.length);
    }, SPOTLIGHT_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative w-full bg-white"
    >
      {/* --- FULL-WIDTH VIDEO HERO. Video spans the full section width
          and is tall enough to hold the ENTIRE content stack (header
          + keyword wall) as an overlay. All copy sits at the bottom
          of the video with a bottom-anchored dark gradient for
          legibility. --- */}
      <div className="relative w-full min-h-screen lg:min-h-[140vh] overflow-hidden">
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
          <source src="/hero/common%20challenges.mp4" type="video/mp4" />
        </video>

        {/* Bottom-anchored darken so the overlay copy is legible over
            any frame of the video; top stays untouched so the Earth
            reads clean. Deeper darken now that both the headline AND
            the keyword wall sit over the footage. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, transparent 30%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        {/* All content overlays the bottom half of the video: header
            (eyebrow + title + description) plus the keyword wall,
            stacked left-aligned in a max-w container. */}
        <div className="absolute inset-x-0 bottom-0 z-[2] pb-10 sm:pb-14 lg:pb-20">
          <div className="mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-14 xl:px-20">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-white/85" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-white"
              />
              Sound familiar?
            </span>

            <h2
              className="serif mt-4 sm:mt-5 text-[clamp(34px,4.6vw,72px)] leading-[1] tracking-[-0.035em] text-white"
              style={{
                fontWeight: 800,
                textShadow: "0 4px 24px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              Common Challenges
              <br />
              we Solve.
            </h2>

            <p
              className="mt-4 sm:mt-5 leading-[1.5] max-w-[600px] text-balance text-[14px] sm:text-[15.5px] text-white/90"
              style={{
                textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              Every shipment carries the same recurring anxieties. That&apos;s
              exactly the weight we take off your desk.
            </p>

            {/* -------- Keyword wall — inline editorial items with the
                sliding three-word underline highlight. White text on
                the video, same style language as the header above. -------- */}
            <div
              onMouseEnter={() => { pausedRef.current = true; }}
              onMouseLeave={() => { pausedRef.current = false; }}
              className="relative mt-8 sm:mt-10 lg:mt-12 flex flex-wrap items-center justify-start gap-x-5 sm:gap-x-6 lg:gap-x-7 gap-y-3.5 sm:gap-y-4 lg:gap-y-5"
            >
          {concerns.map((c, i) => {
            const Icon = c.icon;
            const isActive =
              i === activeIdx ||
              i === (activeIdx + 1) % concerns.length ||
              i === (activeIdx + 2) % concerns.length;
            return (
              <button
                key={c.label}
                type="button"
                onMouseEnter={() => setActiveIdx(i)}
                onFocus={() => setActiveIdx(i)}
                aria-label={c.label}
                aria-pressed={isActive}
                className="group inline-flex items-center gap-2 sm:gap-2.5 text-left rounded transition-colors duration-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-black/30"
              >
                <Icon
                  className="h-[15px] w-[15px] sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px] shrink-0 transition-colors duration-500"
                  style={{
                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
                  }}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span
                  className="font-display uppercase tracking-[0.02em] text-[12.5px] sm:text-[14px] lg:text-[15.5px] leading-none whitespace-nowrap transition-all duration-500"
                  style={{
                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.7)",
                    fontWeight: isActive ? 800 : 600,
                    textDecoration: isActive ? "underline" : "none",
                    textDecorationColor: "#ffffff",
                    textDecorationThickness: "2px",
                    textUnderlineOffset: "6px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
