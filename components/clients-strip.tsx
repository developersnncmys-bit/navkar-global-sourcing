"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { logoClients } from "@/lib/content";

/**
 * Clients showcase — cinema reveal.
 *
 * As the section enters the viewport, two letterbox bars close in from
 * the top and bottom edges and the background fades to pure black —
 * "cinema mode". Once pinned, the title and description reveal word by
 * word, scrubbed against scroll progress (each word fades from faint
 * to full white as you scroll). Finally the logo strip cross-fades in
 * and auto-scrolls horizontally on a continuous loop, independent of
 * scroll position.
 */
const TITLE = "Trusted by the brands that keep global trade moving.";
const DESCRIPTION =
  "From perishables to capital equipment, we've supported 100+ MNCs, corporates and MSMEs with end-to-end EXIM advisory, licensing and logistics — quietly and on the record.";

export function ClientsStrip() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Pure-white screen that scrubs in at the tail of the pin so the
  // section dissolves to white — a classic cinema "fade-to-white" exit.
  const fadeOutRef = useRef<HTMLDivElement>(null);
  // Pure-white screen for the ENTRY — starts at opacity 1 (covers the
  // whole stage), scrubs to 0 as the section approaches the viewport top.
  // Smooths the handoff from the white Testimonials section so the dark
  // cinema mode dissolves IN rather than cutting in.
  const fadeInRef = useRef<HTMLDivElement>(null);

  const titleWords = TITLE.split(" ");
  const descWords = DESCRIPTION.split(" ");

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const titleSpans =
        titleRef.current?.querySelectorAll<HTMLElement>("[data-word]");
      const descSpans =
        descRef.current?.querySelectorAll<HTMLElement>("[data-word]");

      // ----------------------------------------------------------------
      // Marquee — runs independently of scroll. Two copies of the logo
      // set sit back-to-back; xPercent: -50 lands the second copy where
      // the first started, so the loop is seamless.
      // ----------------------------------------------------------------
      const track = trackRef.current;
      let marqueeTween: gsap.core.Tween | null = null;
      if (track) {
        gsap.set(track, { xPercent: 0 });
        marqueeTween = gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: 40,
          repeat: -1,
        });
      }

      if (reduced) {
        if (titleSpans) gsap.set(titleSpans, { opacity: 1 });
        if (descSpans) gsap.set(descSpans, { opacity: 1 });
        gsap.set(
          [topBarRef.current, bottomBarRef.current],
          { height: "8vh" },
        );
        gsap.set(stageRef.current, { backgroundColor: "#000" });
        gsap.set(marqueeRef.current, { opacity: 1 });
        gsap.set(fadeOutRef.current, { opacity: 0 });
        gsap.set(fadeInRef.current, { opacity: 0 });
        ScrollTrigger.refresh();
        return () => {
          marqueeTween?.kill();
        };
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Section is a light AirDoc-style editorial surface — no
        // letterbox bars, no cinema fade veils. Stage bg is pure white
        // to match the JSX surface.
        gsap.set([topBarRef.current, bottomBarRef.current], { height: 0 });
        gsap.set(stageRef.current, { backgroundColor: "#FFFFFF" });
        gsap.set(fadeOutRef.current, { opacity: 0 });
        gsap.set(fadeInRef.current, { opacity: 0 });

        // Faint initial states for words / eyebrow / marquee — brighten
        // on enter via the timeline below.
        if (titleSpans) gsap.set(titleSpans, { opacity: 0.12 });
        if (descSpans) gsap.set(descSpans, { opacity: 0.12 });
        gsap.set(eyebrowRef.current, { opacity: 0, y: 12 });
        gsap.set(marqueeRef.current, { opacity: 0.25, y: 0 });

        // On-enter reveal — non-scrubbed, plays once when the section
        // climbs into view. Same beats as before (eyebrow → title → desc
        // → marquee) but time-based instead of scroll-scrubbed.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          eyebrowRef.current,
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0,
        );

        if (titleSpans?.length) {
          tl.to(
            titleSpans,
            {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
              stagger: { each: 0.04, from: "start" },
            },
            0.15,
          );
        }

        if (descSpans?.length) {
          tl.to(
            descSpans,
            {
              opacity: 0.85,
              duration: 0.4,
              ease: "power2.out",
              stagger: { each: 0.015, from: "start" },
            },
            0.6,
          );
        }

        tl.to(
          marqueeRef.current,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          0.8,
        );

        return () => tl.kill();
      });

      mm.add("(max-width: 767px)", () => {
        // No pin, no scrub. Static light section, all content visible.
        gsap.set([topBarRef.current, bottomBarRef.current], { height: 0 });
        gsap.set(stageRef.current, { backgroundColor: "#FFFFFF" });
        if (titleSpans) gsap.set(titleSpans, { opacity: 1 });
        if (descSpans) gsap.set(descSpans, { opacity: 1 });
        gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
        gsap.set(marqueeRef.current, { opacity: 1, y: 0 });
        gsap.set(fadeOutRef.current, { opacity: 0 });
        gsap.set(fadeInRef.current, { opacity: 0 });
      });

      ScrollTrigger.refresh();
      return () => {
        marqueeTween?.kill();
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative w-full md:h-screen md:overflow-hidden"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Stage — soft off-white surface (AirDoc-style light blue-grey). */}
      <div
        ref={stageRef}
        className="relative w-full h-full overflow-hidden"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* Letterbox bars — kept in the DOM so refs stay valid, but
            visually neutralised: match the surface so they blend in,
            height is driven to 0 via GSAP. */}
        <div
          ref={topBarRef}
          aria-hidden
          className="absolute inset-x-0 top-0 z-30 pointer-events-none"
          style={{ backgroundColor: "#FFFFFF" }}
        />
        <div
          ref={bottomBarRef}
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-30 pointer-events-none"
          style={{ backgroundColor: "#FFFFFF" }}
        />

        {/* Legacy fade veils — kept in DOM for ref stability, hidden. */}
        <div
          ref={fadeInRef}
          aria-hidden
          className="absolute inset-0 z-50 pointer-events-none"
          style={{ backgroundColor: "#FFFFFF" }}
        />
        <div
          ref={fadeOutRef}
          aria-hidden
          className="absolute inset-0 z-40 pointer-events-none"
          style={{ backgroundColor: "#FFFFFF" }}
        />

        <div className="relative z-10 mx-auto max-w-[1320px] wide:max-w-[1560px] h-full px-6 sm:px-10 wide:px-16 pt-[11vh] pb-[11vh] flex flex-col items-center text-[#0e0f1a]">
          {/* Text block — centered stack, AirDoc pattern: pill chip →
              big centered heading → centered description. */}
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center max-w-4xl">
            {/* Pill-chip eyebrow — small rounded white surface with a
                soft border + shadow (mirrors AirDoc's "Your health, our
                mission" chip). Accent dot on the left. */}
            <div ref={eyebrowRef}>
              <span
                className="inline-flex items-center gap-2 rounded-full bg-white border border-black/[0.06] px-3.5 py-1.5 text-[12px] font-semibold tracking-tight text-[#0e0f1a] shadow-[0_2px_10px_-4px_rgba(11,18,32,0.12)]"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "#0B5CFF" }}
                />
                Our clientele
              </span>
            </div>

            <h2
              ref={titleRef}
              className="serif mt-6 sm:mt-8 text-[clamp(32px,4.5vw,68px)] leading-[1.08] tracking-[-0.02em] font-bold text-[#0e0f1a] text-balance"
            >
              {titleWords.map((w, i) => (
                <span
                  key={i}
                  data-word
                  className="inline-block mr-[0.25em] will-change-[opacity]"
                >
                  {w}
                </span>
              ))}
            </h2>

            <p
              ref={descRef}
              className="mt-6 sm:mt-8 text-[clamp(15px,1.3vw,19px)] leading-[1.65] max-w-2xl text-[#4a5061] text-pretty"
            >
              {descWords.map((w, i) => (
                <span
                  key={i}
                  data-word
                  className="inline-block mr-[0.25em] will-change-[opacity]"
                >
                  {w}
                </span>
              ))}
            </p>
          </div>

          {/* Auto-scrolling logo marquee — centered and full-width. */}
          <div
            ref={marqueeRef}
            className="relative mt-8 shrink-0 overflow-hidden w-full"
          >
            {/* Edge gradients fade to the surface colour so the marquee
                fades in/out at the edges instead of hard-cutting. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-32"
              style={{
                background:
                  "linear-gradient(to right, #FFFFFF, rgba(255,255,255,0))",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-32"
              style={{
                background:
                  "linear-gradient(to left, #FFFFFF, rgba(255,255,255,0))",
              }}
            />

            <div
              ref={trackRef}
              className="flex w-max items-center gap-14 sm:gap-20 py-6 will-change-transform"
            >
              {[...logoClients, ...logoClients].map((c, i) => (
                <div
                  key={`${c.name}-${i}`}
                  className="shrink-0 flex items-center justify-center"
                >
                  {/* Logos rendered as full-strength black silhouettes —
                      unified monochrome strip, no muted opacity. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.src}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    style={{ filter: "brightness(0)" }}
                    className="h-10 sm:h-12 w-auto max-w-[160px] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
