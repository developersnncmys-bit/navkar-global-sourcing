"use client";

import { Fragment, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { stats } from "@/lib/content";
import { SectionShell, CTAButton, Eyebrow } from "./ui";

const bodySegments: { text: string; italic?: boolean }[] = [
  { text: "Navkar Global Sourcing is a Mumbai studio shaping export-import practice with" },
  { text: "restraint, regulatory honesty", italic: true },
  { text: "and a devotion to detail — every consignment tuned to the FTP, customs and PGA conditions that decide whether it sails on time." },
];

export function IntroStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statVideoRef = useRef<HTMLVideoElement>(null);

  // Loop just the first 12 seconds of the stats-card video.
  useEffect(() => {
    const v = statVideoRef.current;
    if (!v) return;
    const onTimeUpdate = () => {
      if (v.currentTime >= 12) v.currentTime = 0;
    };
    v.addEventListener("timeupdate", onTimeUpdate);
    return () => v.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();

      // Desktop: section sits in normal document flow (no slide-up over the
      // hero). As it enters the viewport, a dark overlay fades from 1 → 0
      // so the section reads as dark on entry and as light by the time its
      // top edge reaches the viewport top, where it pins. While pinned, a
      // single scrubbed timeline drives the headline word-reveal and the
      // per-stat reveal so they share one source of truth.
      mm.add("(min-width: 768px)", () => {
        const words = headlineRef.current?.querySelectorAll<HTMLSpanElement>(
          "[data-word]",
        );
        const bodyWords = bodyRef.current?.querySelectorAll<HTMLSpanElement>(
          "[data-body-word]",
        );
        const cta = bodyRef.current?.querySelector<HTMLAnchorElement>("a");
        const statEls = statsRef.current?.querySelectorAll<HTMLDivElement>(
          "[data-stat]",
        );

        // Lock starting states immediately so nothing flashes before the pin.
        gsap.set(darkOverlayRef.current, { opacity: 1 });
        if (words?.length) gsap.set(words, { opacity: 0.15 });
        if (bodyWords?.length) gsap.set(bodyWords, { opacity: 0.15 });
        if (cta) gsap.set(cta, { opacity: 0, y: 16 });
        if (statEls?.length) gsap.set(statEls, { opacity: 0, y: 40 });

        // Dark → light dissolve, scrubbed across the full entry so the
        // overlay glides from 1 → 0 over the same scroll the section
        // climbs the viewport. Wide range (`top bottom` → `top top`) +
        // sine ease gives a continuous, smooth gradient feel — no sudden
        // last-mile snap, no early light, no in-pin delay. By the time
        // the section reaches `top top` (pin engage) the overlay is fully
        // clear and the philosophy reveals start.
        gsap.fromTo(
          darkOverlayRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top bottom",
              end: "top top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );

        // Pin holds the section for 360vh = 160vh reveals + 100vh hold (fully
        // revealed, nothing moving) + 100vh for the next section to slide up
        // over a still-stationary IntroStatement.
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=360%",
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        });

        // Reveal timeline scrubs across only the first 160vh of the pin, so
        // headline / body / CTA / stats are all fully revealed by the time
        // the slide-over window begins.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=160%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // 0.00 – 0.22 : headline brightens word-by-word.
        if (words?.length) {
          tl.to(
            words,
            {
              opacity: 1,
              ease: "none",
              stagger: { each: 0.015, from: "start" },
              duration: 0.05,
            },
            0,
          );
        }

        // 0.28 – 0.55 : description brightens word-by-word (same as headline).
        if (bodyWords?.length) {
          tl.to(
            bodyWords,
            {
              opacity: 1,
              ease: "none",
              stagger: { each: 0.007, from: "start" },
              duration: 0.04,
            },
            0.28,
          );
        }

        // 0.55 – 0.60 : CTA slides in.
        if (cta) {
          tl.to(
            cta,
            {
              opacity: 1,
              y: 0,
              ease: "none",
              duration: 0.05,
            },
            0.55,
          );
        }

        // 0.60 – 1.00 : stats reveal one-by-one. Widened stagger (0.11)
        // + shorter per-stat duration (0.08) leaves a small gap between
        // each reveal so the sequence is visibly one-at-a-time rather
        // than an almost-simultaneous fade. `power2.out` gives each stat
        // a soft landing so the slide-in reads on scroll.
        if (statEls?.length) {
          tl.to(
            statEls,
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              stagger: { each: 0.11, from: "start" },
              duration: 0.08,
            },
            0.6,
          );
        }
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative z-10 overflow-hidden bg-background min-h-[80vh] wide:!min-h-[68vh]"
    >
      {/* Dark overlay that fades from 1 → 0 as the section's top edge
          scrolls from the viewport bottom to the viewport top. Pinned on
          top of content (z-50) so the whole section reads as dark during
          entry, then dissolves to reveal the light philosophy section. */}
      <div
        ref={darkOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50 bg-[#06121f]"
      />
      <SectionShell className="pt-8 sm:pt-12 pb-16 sm:pb-24">
          <Eyebrow>Our philosophy</Eyebrow>
          <h2
            ref={headlineRef}
            className="serif mt-8 text-[clamp(28px,3.6vw,58px)] leading-[1.3] max-w-[1300px]"
          >
            <span data-word className="inline-block">Trade</span>{" "}
            <span data-word className="inline-block">that</span>{" "}
            <span data-word className="inline-block serif-italic text-accent">feels</span>{" "}
            <span data-word className="inline-block serif-italic text-accent">like</span>{" "}
            <span data-word className="inline-block">business</span>{" "}
            <span data-word className="inline-block">—</span>{" "}
            <span data-word className="inline-block">every</span>{" "}
            <span data-word className="inline-block">shipment</span>
            <br />
            <span data-word className="inline-block serif-italic text-accent">designed</span>{" "}
            <span data-word className="inline-block">around</span>{" "}
            <span data-word className="inline-block">how</span>{" "}
            <span data-word className="inline-block">you</span>{" "}
            <span data-word className="inline-block">actually</span>{" "}
            <span data-word className="inline-block">work.</span>
          </h2>

          <div
            ref={bodyRef}
            className="mt-8 sm:mt-10 grid gap-8 lg:grid-cols-12 lg:items-end"
          >
            <p className="lg:col-span-7 text-[16px] sm:text-[17px] text-muted max-w-2xl leading-relaxed">
              {bodySegments.flatMap((seg, segI) =>
                seg.text.split(" ").map((w, wI) => (
                  <Fragment key={`${segI}-${wI}`}>
                    <span
                      data-body-word
                      className={`inline-block${seg.italic ? " serif-italic text-foreground" : ""}`}
                    >
                      {w}
                    </span>{" "}
                  </Fragment>
                )),
              )}
            </p>
            <div className="lg:col-span-5 flex lg:justify-end">
              <CTAButton href="/about">Read more</CTAButton>
            </div>
          </div>

          <div
            ref={statsRef}
            className="relative mt-8 sm:mt-12 wide:mt-20 overflow-hidden rounded-3xl border border-white/10"
          >
            <video
              ref={statVideoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src="/images/statvideo-web.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
            {/* Depth overlay — flat 35% base + a bottom-heavy gradient so
                the label row (which sits at the bottom of each cell) has
                enough contrast against the busy port video without darkening
                the whole card. */}
            <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(180deg, rgba(4,12,26,0) 0%, rgba(4,12,26,0.15) 45%, rgba(4,12,26,0.65) 100%)",
              }}
            />

            {/* Content wrapper — padding lives here so the video + overlays
                can bleed full-width. */}
            <div className="relative p-6 sm:p-10 wide:p-14">
              {/* Card header — small anchor row so the stats card doesn't
                  read as a floating grid of numbers. Left: eyebrow label
                  identifying the section. Right: quiet "Est. 2000" tag. */}
              <div className="flex items-center justify-between gap-4 mb-8 sm:mb-10 wide:mb-14">
                <span
                  className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] uppercase text-accent-soft"
                  style={{ textShadow: "0 2px 6px rgba(0,0,0,0.65)" }}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-accent-soft"
                  />
                  By the numbers
                </span>
                <span
                  className="hidden sm:inline text-[10px] font-medium tracking-[0.28em] uppercase text-ivory-on-dark/55"
                  style={{ textShadow: "0 2px 6px rgba(0,0,0,0.65)" }}
                >
                  Est. 2000
                </span>
              </div>

              {/* Stats row — vertical hairlines between cells on lg+ replace
                  the per-stat horizontal underline that used to clutter the
                  layout. Each cell is its own vertical column of value +
                  label, with equal padding so all stats sit on the same
                  visual baseline. */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8">
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    data-stat
                    className={`relative flex flex-col gap-2 sm:gap-3 wide:gap-4 ${
                      i > 0 ? "lg:pl-6 wide:pl-10" : ""
                    } ${
                      i < stats.length - 1
                        ? "lg:pr-6 wide:pr-10 lg:border-r lg:border-white/20"
                        : ""
                    }`}
                  >
                    {/* Big number — single unified form so the reader lands
                        on the whole value at once. `tabular-nums` locks
                        column widths across figures. Layered drop-shadow
                        keeps the digits legible on the busy video without
                        needing a heavier overlay. */}
                    <span
                      className="serif tabular-nums text-[clamp(30px,3vw,48px)] wide:text-[60px] leading-[0.95] tracking-[-0.02em] text-ivory-on-dark"
                      style={{
                        textShadow:
                          "0 2px 4px rgba(0,0,0,0.55), 0 6px 20px rgba(0,0,0,0.65)",
                      }}
                    >
                      {s.value}
                    </span>

                    <span
                      className="text-[10px] sm:text-[11px] wide:text-[12px] font-semibold tracking-[0.22em] uppercase text-ivory-on-dark/85"
                      style={{
                        textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionShell>
    </section>
  );
}
