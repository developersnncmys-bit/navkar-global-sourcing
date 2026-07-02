"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Words for the display headline. Italic words carry the accent tint.
const headlineSegments: { text: string; italic?: boolean }[] = [
  { text: "Four ways to source." },
  { text: "One", italic: true },
  { text: "accountable", italic: true },
  { text: "desk.", italic: true },
];

/**
 * Services hero — dark, full-viewport landing for /services.
 *
 * Mirrors the home HeroShip visual language (deep navy base + video/photo
 * layered under dark scrims + progressive text reveal) without recreating
 * the ship animation. Text reveals on mount via a short GSAP timeline
 * (eyebrow → headline words stagger → subtext → scroll cue). Honors
 * prefers-reduced-motion.
 */
export function ServicesHero() {
  const rootRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const words =
        headlineRef.current?.querySelectorAll<HTMLSpanElement>("[data-word]");

      if (reduced) {
        gsap.set(
          [eyebrowRef.current, subtextRef.current, scrollHintRef.current],
          { opacity: 1, y: 0 },
        );
        if (words?.length) gsap.set(words, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(
        [eyebrowRef.current, subtextRef.current, scrollHintRef.current],
        { opacity: 0, y: 26 },
      );
      if (words?.length) gsap.set(words, { opacity: 0, y: 40 });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      })
        .to(
          words ?? [],
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: { each: 0.055, from: "start" },
          },
          "-=0.35",
        )
        .to(
          subtextRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.55",
        )
        .to(
          scrollHintRef.current,
          { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
          "-=0.35",
        );

      // Subtle background parallax as user scrolls out of the hero.
      gsap.to(bgRef.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      aria-label="Sourcing service plans"
      className="relative w-full min-h-svh overflow-hidden"
      style={{ background: "#06121f", color: "var(--ivory-on-dark)" }}
    >
      {/* Background stack — looping service video + gradient scrims + accent glows. */}
      <div ref={bgRef} aria-hidden="true" className="absolute inset-0">
        <video
          src="/hero/service-web.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        {/* Base dark wash — just enough to keep text legible, video reads through */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,18,31,0.2)_0%,rgba(6,18,31,0.3)_50%,rgba(6,18,31,0.55)_100%)]" />
        {/* Cool accent glows (ocean blue) — dialled back so video colour shows */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_18%_28%,rgba(29,111,184,0.14),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_82%_82%,rgba(79,147,207,0.1),transparent_70%)]" />
        {/* Vignette — softer so the edges don't clamp down on the video */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_50%,rgba(2,6,14,0.3)_100%)]" />
      </div>

      {/* Editorial content */}
      <div className="relative mx-auto max-w-[1100px] w-full px-6 sm:px-10 pt-40 sm:pt-48 pb-24 sm:pb-32 min-h-svh flex flex-col items-center justify-center text-center">
        {/* Text scrim — soft radial dark wash centred on the text block so
            the video reads through the frame but the copy sits on a clean
            backdrop. Blurred edges so it fades organically into the video
            rather than reading as a rectangle. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(960px,92vw)] h-[clamp(320px,42vh,520px)] bg-[radial-gradient(ellipse_at_center,rgba(4,12,26,0.72)_0%,rgba(4,12,26,0.45)_35%,rgba(4,12,26,0.12)_65%,transparent_85%)] blur-[6px]"
        />

        <span
          ref={eyebrowRef}
          className="relative label text-white eyebrow-dot"
        >
          Sourcing service plans
        </span>

        <h1
          ref={headlineRef}
          className="relative serif font-black mt-8 text-[clamp(34px,4.8vw,80px)] leading-[1.05] tracking-[-0.02em] text-balance max-w-[980px] text-white [text-shadow:0_6px_28px_rgba(0,0,0,0.55)]"
        >
          {headlineSegments.map((seg, si) => (
            <Fragment key={si}>
              {seg.text.split(" ").map((w, wi) => (
                <Fragment key={`${si}-${wi}`}>
                  <span
                    data-word
                    className={`inline-block ${
                      seg.italic ? "serif-italic text-white" : ""
                    }`}
                  >
                    {w}
                  </span>{" "}
                </Fragment>
              ))}
            </Fragment>
          ))}
        </h1>

        <p
          ref={subtextRef}
          className="relative mt-8 max-w-2xl text-[17px] sm:text-[19px] leading-relaxed text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]"
        >
          Pick the plan that matches where you are in the sourcing journey —
          whether you already have a supplier in China, need us to find one,
          or want us on the ground with you.
        </p>
      </div>
    </section>
  );
}

export default ServicesHero;
