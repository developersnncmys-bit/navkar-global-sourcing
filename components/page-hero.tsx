"use client";

import { Fragment, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// ────────────────────────────────────────────────────────────────
// PageHero — shared dark video-backed hero used across the
// interior pages (Clientele, Notifications, Contact). Mirrors the
// clientele hero: video → deep-navy gradient (dark bottom for text
// legibility) → radial darken plate under text → centered content.
// Word-by-word rise-reveal on mount, eyebrow + subtitle + meta
// chase on power2.out.
// ────────────────────────────────────────────────────────────────

export type PageHeroMeta = { value: string; label: string };

export function PageHero({
  eyebrow,
  headline,
  subtitle,
  meta,
  videoSrc = "/hero/clientellevideo-web.mp4",
  ariaLabel,
}: {
  eyebrow: string;
  /** Headline text. Wrap with <br/> to break lines. */
  headline: string;
  subtitle?: ReactNode;
  meta?: PageHeroMeta[];
  videoSrc?: string;
  ariaLabel?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
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
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
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
        subtitleRef.current,
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

  // Split the headline into words, keeping <br/> as line breaks.
  const lines = headline.split(/<br\s*\/?>/i);

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative overflow-hidden bg-[#06121f]"
      aria-label={ariaLabel ?? eyebrow}
    >
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Top-to-bottom navy gradient — dark top + darkened bottom band
          for text legibility, letting the video breathe through the
          middle. */}
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

      {/* Radial darken plate anchored where the text sits. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(70% 45% at 50% 78%, rgba(6, 18, 31, 0.55) 0%, rgba(6, 18, 31, 0.25) 55%, transparent 85%)",
        }}
      />

      <div className="relative z-30 px-6 sm:px-10 wide:px-16 pt-32 sm:pt-32 pb-24 sm:pb-32 min-h-screen flex flex-col justify-center">
        <div className="mx-auto max-w-[1320px] wide:max-w-[1560px] w-full">
          <span
            ref={eyebrowRef}
            className="label inline-flex items-center gap-2.5 text-ivory-on-dark/75"
          >
            <span
              aria-hidden="true"
              className="block h-1.5 w-1.5 rounded-full bg-accent-soft"
            />
            {eyebrow}
          </span>

          <h1
            ref={headlineRef}
            className="serif font-bold mt-6 mx-auto text-center text-[clamp(34px,4.4vw,72px)] leading-[1.08] text-balance max-w-[1050px] text-ivory-on-dark"
          >
            {lines.map((line, li) => (
              <Fragment key={li}>
                {line
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((w, wi) => (
                    <Fragment key={`${li}-${wi}`}>
                      <span data-word className="inline-block">
                        {w}
                      </span>{" "}
                    </Fragment>
                  ))}
                {li < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </h1>

          {(subtitle || meta) && (
            <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
              {subtitle && (
                <div
                  ref={subtitleRef}
                  className={`${
                    meta ? "lg:col-span-7" : "lg:col-span-12 mx-auto text-center"
                  } max-w-2xl text-[17px] sm:text-[19px] text-ivory-on-dark/80 leading-relaxed text-pretty`}
                >
                  {subtitle}
                </div>
              )}
              {meta && (
                <div
                  ref={metaRef}
                  className={`${
                    subtitle ? "lg:col-span-5" : "lg:col-span-12"
                  } grid grid-cols-${Math.min(meta.length, 4)} gap-4 sm:gap-6 border-t border-white/15 pt-6`}
                >
                  {meta.map((m) => (
                    <div key={m.label} data-meta className="flex flex-col gap-2">
                      <span className="serif font-bold text-[clamp(34px,3.2vw,52px)] leading-none text-ivory-on-dark">
                        {m.value}
                      </span>
                      <span className="label text-[11px] text-ivory-on-dark/60">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
