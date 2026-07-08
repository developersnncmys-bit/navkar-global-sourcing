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

const pexels = (id: number, w = 560) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const categories: { label: string; src: string; note: string }[] = [
  // Toys — xylophone + ring-stacking toy on white, clean editorial
  { label: "Toys", src: pexels(6743166), note: "Bricks, plush & RC" },
  // Clothing — beige tailored suits on a rack, modern retail editorial
  { label: "Clothing", src: pexels(18699670), note: "Apparel & finishing" },
  // Jewellery — gold necklaces on black display stands, luxury editorial
  { label: "Jewellery", src: pexels(29043373), note: "Fashion & fine stone" },
  // Furniture — wooden dining table with leather seating, warm modern
  { label: "Furniture", src: pexels(8082211), note: "Wood & upholstery" },
  // Accessories — top-down luxury leather wallets, tan & brown tones
  { label: "Accessories", src: pexels(28028316), note: "Leather & silver" },
  // Electronics — wireless earbuds + charging case, minimalist monochrome
  { label: "Electronics", src: pexels(17810093), note: "Consumer & OEM" },
  // Stationery — mint green notebook + pen, clean flatlay
  { label: "Stationery", src: pexels(12914430), note: "Paper & desk supply" },
  // Hardware — steel wrenches on a white backdrop, clean editorial
  { label: "Hardware", src: pexels(220639), note: "Fasteners & tools" },
  // Machinery — CNC machine mid-cut with coolant splashing, dynamic
  { label: "Machinery", src: pexels(8956445), note: "Light industrial" },
  // Home decor — ceramic vase with decorative branches on wooden tray
  { label: "Home decor", src: pexels(16411135), note: "Interiors & gifting" },
  // Footwear & bags — brown leather shoes on wooden table, editorial
  { label: "Footwear & bags", src: pexels(33039735), note: "Leather & performance" },
];

const easeExpo = [0.22, 1, 0.36, 1] as const;

// Row splits — first 6 in lane 1, remaining 5 in lane 2.
const laneA = categories.slice(0, 6);
const laneB = categories.slice(6);

export function ProductCategories() {
  const rootRef = useRef<HTMLElement>(null);
  const laneAref = useRef<HTMLDivElement>(null);
  const laneBref = useRef<HTMLDivElement>(null);
  const marqueeWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

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
      style={{ background: "var(--gradient-zoom)" }}
    >
      <div className="relative py-14 sm:py-20 lg:py-24">
        {/* ---------- Header — medium editorial ---------- */}
        <div className="mx-auto max-w-[1000px] px-5 sm:px-10 lg:px-14 mb-10 sm:mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: easeExpo }}
            className="flex flex-col items-center gap-6"
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] uppercase text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              What we source
            </span>
            <h2 className="serif font-black whitespace-nowrap text-[clamp(24px,5vw,68px)] leading-[0.95] tracking-[-0.045em] text-white [text-shadow:0_4px_28px_rgba(9,24,55,0.45)]">
              Categories,{" "}
              <span className="serif font-black text-white/95">
                we cater to.
              </span>
            </h2>
            <p className="text-[14px] sm:text-[15px] text-white leading-relaxed text-pretty max-w-[560px]">
              Eleven sourcing lines in continuous motion — bulk hardware to
              boutique jewellery, each with its own vetted factory bench.
              Hover the lanes to slow them down.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <a
                href="/clientele"
                className="group inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-white hover:text-black transition-colors"
              >
                Browse the full catalog
                <ArrowUpRight
                  size={13}
                  strokeWidth={2}
                  className="transition-transform group-hover:rotate-45"
                />
              </a>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white">
                {String(categories.length).padStart(2, "0")} lines · sampled &amp; shipped
              </span>
            </div>
          </motion.div>
        </div>

        {/* ---------- Kinetic dual-marquee ---------- */}
        <div
          ref={marqueeWrapRef}
          className="relative"
          aria-label="Category lanes"
        >
          {/* Lane A — moving left on desktop, swipeable on mobile */}
          <div className="overflow-x-auto md:overflow-hidden no-scrollbar snap-x snap-mandatory md:snap-none scroll-pl-5 md:scroll-pl-0 px-5 md:px-0">
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
                  className="snap-start md:snap-none shrink-0 mr-3 sm:mr-5 w-[220px] sm:w-[260px] lg:w-[280px]"
                >
                  <CategoryTile {...c} />
                </div>
              ))}
            </div>
          </div>

          {/* Lane B — moving right, sits below Lane A with a small gap.
              Includes the CTA tile at the end of each set. */}
          <div className="overflow-x-auto md:overflow-hidden no-scrollbar snap-x snap-mandatory md:snap-none scroll-pl-5 md:scroll-pl-0 px-5 md:px-0 mt-3 sm:mt-5">
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
                      className="snap-start md:snap-none shrink-0 mr-3 sm:mr-5 w-[220px] sm:w-[260px] lg:w-[280px]"
                    >
                      <CategoryTile {...c} />
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
  label,
  src,
  note,
}: {
  label: string;
  src: string;
  note: string;
}) {
  return (
    <a
      href="/clientele"
      className="group relative block aspect-square overflow-hidden rounded-[28px] shadow-[0_12px_32px_-14px_rgba(9,24,55,0.5),0_3px_8px_-3px_rgba(9,24,55,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-16px_rgba(9,24,55,0.6),0_5px_12px_-3px_rgba(9,24,55,0.35)]"
      aria-label={`${label} — ${note}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]"
      />

      {/* Dark gradient overlay — anchors the text and gives contrast
          against varied image content. Deeper near the bottom, fades to
          transparent by the top third so the image reads clearly. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
      />

      {/* Inner light-rim + top-highlight — reproduces Zoom's card feel
          where the tile edge catches ambient light. Sits above the image
          and overlay so the highlight always reads on the border. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.06)]"
      />

      {/* Title + note sit inside the image at the bottom. */}
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h3 className="serif text-[18px] font-semibold leading-[1.2] tracking-[-0.01em]">
          {label}
        </h3>
        <p className="mt-1 text-[12.5px] leading-[1.35] text-white/80">
          {note}
        </p>
      </div>
    </a>
  );
}

