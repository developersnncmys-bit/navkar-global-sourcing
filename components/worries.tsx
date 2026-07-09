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
 * Revised layout matching the reference: Zoom-gradient background
 * (dark navy → royal blue → white) same as the "Categories we cater
 * to" section. Centered editorial header with a green-pulse eyebrow
 * pill and a serif title with italic accent on "we Solve." Below,
 * a centered wrap of seventeen icon + label pills — a three-pill
 * sliding spotlight fills white while resting pills stay translucent
 * over the blue. Closes with a three-column stats bar (17 concerns /
 * 25y handling / 01 accountable desk) as an editorial payoff.
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
  const [activeIdx, setActiveIdx] = useState(0);
  // Pauses the auto-cycle while the reader is hovering the wall so the
  // interval doesn't shove them off the keyword they're reading.
  const pausedRef = useRef(false);

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
      data-nav-theme="dark"
      className="relative w-full overflow-hidden pt-14 sm:pt-16 lg:pt-20 pb-40 sm:pb-48 lg:pb-56"
      style={{
        // Single continuous background: an alpha-fading blue ramp
        // layered over a white base. The blue holds solid through
        // 0–65% (header + pills), then dissolves through decreasing
        // alpha 65→100% so the very bottom of the section is pure
        // white — matching the next (light) section's ground. One
        // gradient, one seam.
        background:
          "linear-gradient(180deg, #071230 0%, #0D1E44 8%, #142457 18%, #1B2E6E 30%, #2E479A 45%, #4059B8 60%, rgba(64,89,184,0.75) 72%, rgba(90,115,206,0.40) 84%, rgba(90,115,206,0.12) 93%, rgba(90,115,206,0) 100%), #ffffff",
      }}
    >
      <div className="relative z-[2] mx-auto max-w-[1240px] px-6 sm:px-10 lg:px-14">
        {/* -------- Centered header — eyebrow pill + serif title with
            italic accent + subtitle. Matches the reference screenshot's
            layout language. -------- */}
        <div className="max-w-[1120px] mx-auto text-center">
          {/* Eyebrow — rounded pill with a green accent dot + label */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-sm px-4 py-2 text-[10.5px] font-semibold tracking-[0.26em] uppercase text-white/90">
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping"
                style={{ background: "#4ADE80" }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: "#4ADE80" }}
              />
            </span>
            Sound familiar?
          </span>

          <h2
            className="serif mt-5 sm:mt-6 text-[clamp(28px,4vw,62px)] leading-[1.05] tracking-[-0.028em] text-white whitespace-nowrap"
            style={{ fontWeight: 800 }}
          >
            Common Challenges{" "}
            <span
              className="serif-italic"
              style={{
                color: "#B4C2ED",
                fontWeight: 700,
              }}
            >
              we Solve.
            </span>
          </h2>

          <p className="mt-4 sm:mt-5 text-white/78 leading-[1.55] max-w-[620px] mx-auto text-balance text-[14.5px] sm:text-[16px]">
            Every shipment carries the same recurring anxieties. That&apos;s
            exactly the weight we take off your desk.
          </p>
        </div>

        {/* -------- Keyword pill grid — 17 concerns as icon + label
            pills arranged in a centered wrap. Sliding three-pill
            spotlight brightens as it advances. Resting pills use a
            subtle white/dark tint that reads on the blue portion of
            the gradient; active pills fill solid white with dark
            text for high-contrast spotlighting. -------- */}
        <div
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          className="relative mt-8 sm:mt-10 lg:mt-14 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
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
                className="group inline-flex items-center gap-2 sm:gap-2.5 rounded-full border transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 px-3.5 sm:px-4 py-2 sm:py-[9px]"
                style={{
                  background: isActive
                    ? "#ffffff"
                    : "rgba(255,255,255,0.05)",
                  borderColor: isActive
                    ? "#ffffff"
                    : "rgba(255,255,255,0.20)",
                  boxShadow: isActive
                    ? "0 14px 30px -12px rgba(255,255,255,0.35), 0 4px 10px -4px rgba(4,10,24,0.35)"
                    : "0 1px 2px rgba(4,10,24,0.15)",
                  transform: isActive ? "translateY(-1px)" : "translateY(0)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              >
                <Icon
                  className="h-[14px] w-[14px] sm:h-4 sm:w-4 lg:h-[17px] lg:w-[17px] shrink-0 transition-colors duration-500"
                  style={{
                    color: isActive ? "#0D1E44" : "rgba(255,255,255,0.75)",
                  }}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span
                  className="font-display uppercase tracking-[0.02em] text-[11.5px] sm:text-[12.5px] lg:text-[13.5px] leading-none whitespace-nowrap transition-colors duration-500"
                  style={{
                    color: isActive ? "#0D1E44" : "rgba(255,255,255,0.92)",
                    fontWeight: isActive ? 700 : 600,
                  }}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
