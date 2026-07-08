"use client";

import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/content";

const clientPortraits = [
  "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
];

const attributions = [
  { name: "H. Rackham", role: "Head of Sourcing at RR Global Ltd" },
  { name: "M. Kulkarni", role: "Operations Lead at Alicon Castalloy Ltd" },
  { name: "S. Patel", role: "Managing Director at Ruchi Soya" },
];

const AUTOPLAY_MS = 6500;

// Card sizing constants — kept fixed (not viewport-scaled) so the coverflow
// geometry stays predictable at any breakpoint. The stage width below is
// computed relative to CARD_W to control the side-card overlap.
const CARD_W = 360;
const CARD_H = 340;

export function Testimonials() {
  const [active, setActive] = useState(0);
  const total = testimonials.length;
  const pausedRef = useRef(false);

  useEffect(() => {
    if (pausedRef.current) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [total, active]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
    setActive((i) => i);
  };

  const go = (dir: 1 | -1) => setActive((i) => (i + dir + total) % total);

  return (
    <section
      data-nav-theme="light"
      className="relative bg-background overflow-hidden"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-10 wide:px-14 py-14 md:py-20">
        {/* ---------- Header ---------- */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] uppercase text-black/55">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            What clients say
          </span>
          <h2
            className="serif font-bold mt-3 text-black text-balance"
            style={{
              fontSize: "clamp(22px, 2.4vw, 38px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Trusted by clients
          </h2>
        </div>

        {/* ---------- Coverflow card stage ----------
            Fixed height, [perspective] enables 3D rotateY on the cards.
            The mt-12/16 gives the header clean space; cards can never
            overlap it because they're contained in this stage div. */}
        <div
          className="relative mt-12 sm:mt-16 mx-auto [perspective:1400px]"
          style={{ height: CARD_H + 40 }}
        >
          {testimonials.map((t, i) => {
            let offset = i - active;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isActive = offset === 0;
            const isAdjacent = Math.abs(offset) === 1;

            // 3D coverflow transforms
            const translateX = offset * 220; // px, not %
            const rotateY = offset * -18; // deg
            const scale = isActive ? 1 : 0.82;
            const opacity = isActive ? 1 : isAdjacent ? 0.6 : 0;
            const zIndex = 10 - Math.abs(offset);

            const attribution = attributions[i] ?? {
              name: "Client",
              role: t.company,
            };
            const portrait = clientPortraits[i] ?? clientPortraits[0];

            return (
              <button
                key={t.company}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className="absolute left-1/2 top-1/2 text-left transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  transform: `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  pointerEvents: Math.abs(offset) > 1 ? "none" : "auto",
                }}
                tabIndex={isActive ? 0 : -1}
              >
                <TestimonialCard
                  active={isActive}
                  quote={t.quote}
                  name={attribution.name}
                  role={attribution.role}
                  portrait={portrait}
                />
              </button>
            );
          })}
        </div>

        {/* ---------- Prev/next arrows ---------- */}
        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="grid place-items-center h-10 w-10 rounded-full border border-black/15 text-black/70 hover:border-black hover:bg-black hover:text-white transition-colors"
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

          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-black/50 tabular-nums">
            {String(active + 1).padStart(2, "0")}
            <span className="mx-1.5 text-black/25">/</span>
            {String(total).padStart(2, "0")}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="grid place-items-center h-10 w-10 rounded-full border border-black/15 text-black/70 hover:border-black hover:bg-black hover:text-white transition-colors"
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
        </div>

        {/* ---------- Footer CTAs ---------- */}
        <div className="mt-10 sm:mt-14 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/clientele"
              className="group inline-flex items-center gap-2 rounded-full bg-black text-white px-4 sm:px-5 py-2.5 text-[13px] font-semibold transition-colors hover:bg-accent"
            >
              See all clients
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-black/20 text-black px-4 sm:px-5 py-2.5 text-[13px] font-semibold transition-colors hover:border-black hover:bg-black hover:text-white"
            >
              Share yours
            </a>
          </div>

          <div className="text-[12px] leading-tight text-black/60 sm:text-right">
            <span>Trusted across textiles, jewellery, agri and more.</span>
            <span className="mx-1.5 text-black/25">·</span>
            <span className="font-semibold text-black">Est. 2000 · Mumbai</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  active,
  quote,
  name,
  role,
  portrait,
}: {
  active: boolean;
  quote: string;
  name: string;
  role: string;
  portrait: string;
}) {
  return (
    <div
      className={`relative h-full w-full p-6 rounded-[22px] flex flex-col transition-colors duration-500 ${
        active
          ? "text-white shadow-[0_30px_60px_-24px_rgba(46,71,154,0.55)] ring-1 ring-white/15"
          : "text-black/80 shadow-[0_10px_28px_-14px_rgba(9,24,55,0.25)] ring-1 ring-black/10"
      }`}
      style={{
        background: active
          ? "linear-gradient(160deg, #4059B8 0%, #2E479A 55%, #1B2E6E 100%)"
          : "#F4F6FC",
      }}
    >
      {/* Top: square portrait */}
      <div
        className={`relative h-12 w-12 rounded-[10px] overflow-hidden shrink-0 ring-2 ${
          active ? "ring-white/30" : "ring-black/10"
        } bg-white/5`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portrait}
          alt={name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Middle: italic quote */}
      <blockquote
        className="mt-4 flex-1 serif italic text-pretty overflow-hidden"
        style={{
          fontSize: "14px",
          lineHeight: 1.5,
          letterSpacing: "-0.005em",
        }}
      >
        <span className="line-clamp-6">&ldquo;{quote}&rdquo;</span>
      </blockquote>

      {/* Bottom: attribution */}
      <div
        className={`mt-4 pt-4 border-t ${
          active ? "border-white/20" : "border-black/10"
        }`}
      >
        <div
          className={`text-[10px] font-mono tracking-[0.18em] uppercase ${
            active ? "text-white/75" : "text-black/50"
          }`}
        >
          Navkar Client
        </div>
        <div
          className={`mt-1 serif italic text-[13px] leading-snug ${
            active ? "text-white" : "text-black"
          }`}
          style={{ letterSpacing: "-0.005em" }}
        >
          — {name}, {role}
        </div>
      </div>
    </div>
  );
}
