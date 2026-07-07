"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ArrowUpRight } from "lucide-react";

/**
 * Product Categories — homepage teaser.
 *
 * Kinetic dual-marquee: instead of a static grid, the 11 sourcing
 * lines flow through two opposing horizontal lanes. Row 1 (cats 1-6)
 * drifts left; row 2 (cats 7-11 + catalog CTA-tile) drifts right at a
 * slightly slower pace, creating a parallax feel. Both lanes loop
 * infinitely via GSAP. Hover anywhere in the marquee area slows both
 * lanes to a near-freeze so the visitor can read. On section entry
 * each tile fans in from off-screen with a staggered rise + scale.
 *
 * Metaphor: continuous flow of goods across our desk — the categories
 * are always sailing.
 */

const pexels = (id: number, w = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const categories: { label: string; src: string; note: string }[] = [
  // Toys — colorful children's blocks, high contrast on dark bg
  { label: "Toys", src: pexels(3663116), note: "Bricks, plush & RC" },
  // Clothing — tailored suits on a rack, editorial fashion tone
  { label: "Clothing", src: pexels(934070), note: "Apparel & finishing" },
  // Jewellery — layered gold necklace, editorial jewelry shot
  { label: "Jewellery", src: pexels(1191531), note: "Fashion & fine stone" },
  // Furniture — warm modern interior, reads as premium residential
  { label: "Furniture", src: pexels(1571460), note: "Wood & upholstery" },
  // Accessories — leather handbag, sculpted product shot
  { label: "Accessories", src: pexels(1152077), note: "Leather & silver" },
  // Electronics — camera + headphones on wood, clear tech read
  { label: "Electronics", src: pexels(356056), note: "Consumer & OEM" },
  // Stationery — pens & planner on desk, premium paper feel
  { label: "Stationery", src: pexels(210661), note: "Paper & desk supply" },
  // Hardware — tools on a workshop bench
  { label: "Hardware", src: pexels(1409216), note: "Fasteners & tools" },
  // Machinery — industrial equipment, warehouse tone
  { label: "Machinery", src: pexels(1267320), note: "Light industrial" },
  // Home decor — candles / ceramics arrangement
  { label: "Home decor", src: pexels(1090638), note: "Interiors & gifting" },
  // Footwear & bags — leather footwear editorial
  { label: "Footwear & bags", src: pexels(267202), note: "Leather & performance" },
];

const easeExpo = [0.22, 1, 0.36, 1] as const;

// Row splits — first 6 in lane 1, remaining 5 in lane 2.
const laneA = categories.slice(0, 6);
const laneB = categories.slice(6);

export function ProductCategories() {
  const rootRef = useRef<HTMLElement>(null);
  const lightOverlayRef = useRef<HTMLDivElement>(null);
  const laneAref = useRef<HTMLDivElement>(null);
  const laneBref = useRef<HTMLDivElement>(null);
  const marqueeWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(lightOverlayRef.current, { opacity: 0 });
        return;
      }

      // No entry-overlay tween. Section-above (GroupCompaniesSection)
      // is light, this section is dark — a clean edge reads better
      // than a white plate dissolving to reveal dark content, which
      // washes out the header text mid-transition.
      gsap.set(lightOverlayRef.current, { opacity: 0 });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {

        // ── Marquee tweens ──
        // Lane A moves LEFT: xPercent 0 → -50 (content is duplicated
        // inside the lane so -50% lands exactly on the seam of the
        // repeated content — seamless loop).
        const laneATween = gsap.to(laneAref.current, {
          xPercent: -50,
          duration: 55,
          ease: "none",
          repeat: -1,
        });

        // Lane B moves RIGHT: xPercent -50 → 0. Slightly slower so the
        // two lanes drift out of sync and read as parallax.
        const laneBTween = gsap.fromTo(
          laneBref.current,
          { xPercent: -50 },
          { xPercent: 0, duration: 68, ease: "none", repeat: -1 },
        );

        // Hover anywhere in the marquee stack → both lanes slow to a
        // near-freeze so a visitor can read the tile labels.
        const wrap = marqueeWrapRef.current;
        if (wrap) {
          const slow = () => {
            gsap.to(laneATween, { timeScale: 0.08, duration: 0.5 });
            gsap.to(laneBTween, { timeScale: 0.08, duration: 0.5 });
          };
          const resume = () => {
            gsap.to(laneATween, { timeScale: 1, duration: 0.8 });
            gsap.to(laneBTween, { timeScale: 1, duration: 0.8 });
          };
          wrap.addEventListener("mouseenter", slow);
          wrap.addEventListener("mouseleave", resume);
        }

        // ── Entrance ──
        // Lane A tiles fan up + fade from below with stagger.
        const laneATiles = laneAref.current?.querySelectorAll("[data-tile]");
        if (laneATiles?.length) {
          gsap.from(laneATiles, {
            y: 90,
            opacity: 0,
            scale: 0.9,
            ease: "power4.out",
            duration: 1,
            stagger: { each: 0.05, from: "start" },
            scrollTrigger: {
              trigger: marqueeWrapRef.current,
              start: "top 78%",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }

        // Lane B tiles fan down + fade from above, staggered opposite
        // direction so the two lanes visually meet in the middle.
        const laneBTiles = laneBref.current?.querySelectorAll("[data-tile]");
        if (laneBTiles?.length) {
          gsap.from(laneBTiles, {
            y: -90,
            opacity: 0,
            scale: 0.9,
            ease: "power4.out",
            duration: 1,
            stagger: { each: 0.05, from: "end" },
            scrollTrigger: {
              trigger: marqueeWrapRef.current,
              start: "top 70%",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });
      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative w-full overflow-hidden -mt-2"
      style={{ background: "#050505" }}
    >
      {/* Entry overlay — matches the light GroupCompaniesSection above,
          then dissolves as the section's top climbs the viewport so the
          seam reads as a smooth light → dark fade instead of a hard cut. */}
      <div
        ref={lightOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50"
        style={{ background: "#ffffff" }}
      />

      <div className="relative py-16 sm:py-20 lg:py-24">
        {/* ---------- Header — medium editorial ---------- */}
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: easeExpo }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div className="max-w-[640px]">
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] uppercase" style={{ color: "#3ab8bd" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#3ab8bd" }} />
                What we source
              </span>
              <h2 className="serif font-black mt-4 text-[clamp(30px,3.8vw,52px)] leading-[1] tracking-[-0.02em] text-white text-balance uppercase">
                Categories,{" "}
                <span className="serif-italic" style={{ color: "#3ab8bd" }}>
                  we cater to.
                </span>
              </h2>
              <p className="mt-4 text-[14px] sm:text-[15px] text-white/60 leading-relaxed text-pretty max-w-[520px]">
                Eleven sourcing lines in continuous motion — bulk hardware to
                boutique jewellery, each with its own vetted factory bench.
                Hover the lanes to slow them down.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/45">
                {String(categories.length).padStart(2, "0")} lines · sampled &amp; shipped
              </span>
              <a
                href="/clientele"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[12px] font-semibold text-white hover:bg-white hover:text-black transition-colors"
              >
                Browse the full catalog
                <ArrowUpRight
                  size={13}
                  strokeWidth={2}
                  className="transition-transform group-hover:rotate-45"
                />
              </a>
            </div>
          </motion.div>
        </div>

        {/* ---------- Kinetic dual-marquee ---------- */}
        <div
          ref={marqueeWrapRef}
          className="relative"
          aria-label="Category lanes"
        >
          {/* Lane A — moving left */}
          <div className="overflow-hidden">
            <div
              ref={laneAref}
              className="flex w-max will-change-transform"
              style={{ transform: "translateX(0)" }}
            >
              {/* Content duplicated once — the tween shifts by exactly
                  -50% of container width, landing on the seam of the
                  repeated set for a seamless loop. Each tile carries a
                  mr-4 so the trailing gap is part of one set's width. */}
              {[...laneA, ...laneA].map((c, i) => (
                <div
                  key={`a-${i}`}
                  data-tile
                  className="shrink-0 mr-4 sm:mr-5 w-[220px] sm:w-[260px] lg:w-[280px]"
                >
                  <CategoryTile index={(i % laneA.length) + 1} {...c} />
                </div>
              ))}
            </div>
          </div>

          {/* Lane B — moving right, sits below Lane A with a small gap.
              Includes the CTA tile at the end of each set. */}
          <div className="overflow-hidden mt-4 sm:mt-5">
            <div
              ref={laneBref}
              className="flex w-max will-change-transform"
              style={{ transform: "translateX(0)" }}
            >
              {[0, 1].map((setIndex) => (
                <div key={setIndex} className="flex shrink-0">
                  {laneB.map((c, i) => (
                    <div
                      key={`b-${setIndex}-${i}`}
                      data-tile
                      className="shrink-0 mr-4 sm:mr-5 w-[220px] sm:w-[260px] lg:w-[280px]"
                    >
                      <CategoryTile index={i + 7} {...c} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryTile({
  index,
  label,
  src,
  note,
}: {
  index: number;
  label: string;
  src: string;
  note: string;
}) {
  return (
    <a
      href="/clientele"
      className="group relative block overflow-hidden rounded-xl aspect-[4/5] transition-shadow duration-500"
      style={{
        background: "#0a0a0a",
      }}
      aria-label={`${label} — ${note}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
      />

      {/* Webflow-style inset vignette — a soft dark inner shadow around
          the image edges so each tile reads as recessed into the dark
          surface. Multi-layer: hairline top highlight, deep inner
          vignette on all sides, hairline outer border. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl z-[2]"
        style={{
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.08)",
            "inset 0 0 0 1px rgba(255,255,255,0.04)",
            "inset 0 -30px 60px -20px rgba(0,0,0,0.55)",
            "inset 0 30px 60px -30px rgba(0,0,0,0.35)",
            "inset 20px 0 40px -30px rgba(0,0,0,0.35)",
            "inset -20px 0 40px -30px rgba(0,0,0,0.35)",
          ].join(", "),
        }}
      />

      {/* Bottom scrim so the label reads over any image tone. Sits
          above the inset shadow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/85 via-black/25 to-transparent"
      />
      {/* Number badge — top-left glass pill. */}
      <span
        aria-hidden="true"
        className="absolute top-2.5 left-2.5 z-[4] rounded-full bg-white/85 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] tracking-[0.16em] text-black"
      >
        {String(index).padStart(2, "0")}
      </span>
      {/* Label — reveals note on hover. */}
      <div className="absolute inset-x-0 bottom-0 z-[4] p-3 sm:p-4 transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
        <span className="serif text-white text-[15px] sm:text-[17px] font-bold tracking-[-0.01em] leading-[1.1] block">
          {label}
        </span>
        <span className="mt-0.5 block text-[10px] font-medium text-white/70 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {note}
        </span>
      </div>
      {/* Ocean Teal corner accent on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-[4] h-[3px] w-0 group-hover:w-full transition-[width] duration-700 ease-out"
        style={{ background: "#3ab8bd" }}
      />
    </a>
  );
}

