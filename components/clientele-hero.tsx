"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// ────────────────────────────────────────────────────────────────
// Clientele hero — mirrors the About page hero: dark video-backed
// stage, deep-navy gradient overlays, big serif headline with an
// italic accent phrase. Reveal choreography matches HeroShip on
// the home page (eyebrow + subtext fade in on mount, headline
// rises + fades in shortly after).
// ────────────────────────────────────────────────────────────────

export function ClienteleHero() {
  const rootRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const words = headlineRef.current?.querySelectorAll<HTMLElement>("[data-word]");
      const metaItems = metaRef.current?.querySelectorAll<HTMLDivElement>("[data-meta]");

      if (reduced) {
        if (words?.length) gsap.set(words, { opacity: 1, y: 0 });
        if (metaItems?.length) gsap.set(metaItems, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(eyebrowRef.current, { opacity: 0, y: 20 });
      if (words?.length) gsap.set(words, { opacity: 0, y: 24 });
      gsap.set(subtextRef.current, { opacity: 0, y: 20 });
      if (metaItems?.length) gsap.set(metaItems, { opacity: 0, y: 20 });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      });
      if (words?.length) {
        tl.to(
          words,
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            duration: 0.9,
            stagger: { each: 0.06, from: "start" },
          },
          "-=0.4",
        );
      }
      tl.to(
        subtextRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4",
      );
      if (metaItems?.length) {
        tl.to(
          metaItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: { each: 0.08, from: "start" },
          },
          "-=0.5",
        );
      }
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative overflow-hidden bg-[#06121f]"
      aria-label="Clientele hero"
    >
      {/* Background video — clientele-specific clip, loops under a
          deep-navy gradient so the section reads as a dark editorial
          stage. z-0 so overlays and content stack above it. */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="/hero/clientellevideo-web.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Top-to-mid navy gradient — anchors the title area, then feathers
          out over the lower half so the waves footage plays through.
          z-10 so it sits above the video but behind the text. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(180deg,
            #06121f 0%,
            #0a1726 15%,
            #0f2547 30%,
            #0f2547 40%,
            rgba(15, 37, 71, 0.45) 55%,
            rgba(6, 18, 31, 0.55) 78%,
            rgba(6, 18, 31, 0.72) 100%)`,
        }}
      />

      {/* Radial darken plate — anchored where the text block sits
          (bottom-centre) so the headline gets a soft dark backing
          without dimming the whole frame. z-20 keeps it behind the
          text (which is z-30 via `relative`). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(70% 45% at 50% 78%, rgba(6, 18, 31, 0.55) 0%, rgba(6, 18, 31, 0.25) 55%, transparent 85%)",
        }}
      />

      <div className="relative z-30 px-5 sm:px-10 wide:px-16 pt-28 sm:pt-32 pb-20 sm:pb-32 min-h-screen flex flex-col justify-center">
        <div className="mx-auto max-w-[1320px] wide:max-w-[1560px] w-full">
          <span
            ref={eyebrowRef}
            className="label inline-flex items-center gap-2.5 text-ivory-on-dark/75"
          >
            <span
              aria-hidden="true"
              className="block h-1.5 w-1.5 rounded-full bg-accent-soft"
            />
            The Clientele
          </span>

          <h1
            ref={headlineRef}
            className="serif font-bold mt-4 sm:mt-6 mx-auto text-center text-[clamp(28px,4.4vw,72px)] leading-[1.08] text-balance max-w-[1050px] text-ivory-on-dark"
          >
            <span data-word className="inline-block">500+</span>{" "}
            <span data-word className="inline-block">shippers.</span>
            <br />
            <span data-word className="inline-block text-white">100+</span>{" "}
            <span data-word className="inline-block text-white">MNCs,</span>{" "}
            <span data-word className="inline-block text-white">corporates</span>{" "}
            <span data-word className="inline-block text-white">&amp;</span>{" "}
            <span data-word className="inline-block text-white">MSMEs.</span>
          </h1>

          <div className="mt-8 sm:mt-10 grid gap-8 sm:gap-10 lg:grid-cols-12 lg:items-end">
            <p
              ref={subtextRef}
              className="lg:col-span-7 max-w-2xl text-[15.5px] sm:text-[19px] text-ivory-on-dark/80 leading-relaxed text-pretty"
            >
              A quiet track record built one relationship at a time — from
              household MNCs to first-time exporters finding their feet.
            </p>

            <div
              ref={metaRef}
              className="lg:col-span-5 grid grid-cols-3 gap-3 sm:gap-6 border-t border-white/15 pt-5 sm:pt-6"
            >
              <div data-meta className="flex flex-col gap-1.5 sm:gap-2">
                <span className="serif font-bold text-[clamp(24px,3.2vw,52px)] leading-none text-ivory-on-dark">
                  500+
                </span>
                <span className="label text-[10px] sm:text-[11px] text-ivory-on-dark/60">Shippers</span>
              </div>
              <div data-meta className="flex flex-col gap-1.5 sm:gap-2">
                <span className="serif font-bold text-[clamp(24px,3.2vw,52px)] leading-none text-ivory-on-dark">
                  100+
                </span>
                <span className="label text-[10px] sm:text-[11px] text-ivory-on-dark/60">MNCs &amp; MSMEs</span>
              </div>
              <div data-meta className="flex flex-col gap-1.5 sm:gap-2">
                <span className="serif font-bold text-[clamp(24px,3.2vw,52px)] leading-none text-ivory-on-dark">
                  25y
                </span>
                <span className="label text-[10px] sm:text-[11px] text-ivory-on-dark/60">On the record</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
