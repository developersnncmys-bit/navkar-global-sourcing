"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { stats } from "@/lib/content";
import { Eyebrow } from "./ui";

/**
 * StatsBand — dark video section with a white → dark dissolve on entry
 * (bleeds the previous light AboutValues section into the dark video
 * cleanly), then a scrubbed sequential reveal of the four stats. Layout
 * mirrors the home-page IntroStatement stats card.
 */
export function StatsBand() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(whiteOverlayRef.current, { opacity: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const statEls =
          statsRef.current?.querySelectorAll<HTMLDivElement>("[data-stat]");

        gsap.set(whiteOverlayRef.current, { opacity: 1 });
        if (introRef.current) gsap.set(introRef.current, { opacity: 0, y: 24 });
        if (statEls?.length) gsap.set(statEls, { opacity: 0, y: 40 });

        // White → dark dissolve. Overlay drops from 1 → 0 as the
        // section's top edge climbs from viewport bottom to viewport
        // top, so the white AboutValues bleeds into the dark video
        // without a hard seam.
        gsap.fromTo(
          whiteOverlayRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top bottom",
              end: "top 30%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );

        // Pin holds the section for +=200% (100% for reveal, 100% dwell).
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        // Sequential reveal timeline — normalised 0 → 1 across the first
        // 100% of the pin. Intro fades in, then each stat pops one after
        // the other so the numbers land in sequence.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=100%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        if (introRef.current) {
          tl.to(
            introRef.current,
            { opacity: 1, y: 0, ease: "none", duration: 0.25 },
            0,
          );
        }
        if (statEls?.length) {
          tl.to(
            statEls,
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              stagger: { each: 0.18, from: "start" },
              duration: 0.35,
            },
            0.2,
          );
        }
      });

      ScrollTrigger.refresh();

      // Loop the first 12 seconds of the video for a tight, repeating clip.
      const v = videoRef.current;
      if (v) {
        const onTimeUpdate = () => {
          if (v.currentTime >= 12) v.currentTime = 0;
        };
        v.addEventListener("timeupdate", onTimeUpdate);
        return () => v.removeEventListener("timeupdate", onTimeUpdate);
      }
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative w-full overflow-hidden min-h-screen"
    >
      {/* Background video — plain, no gradient/overlay on top. */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/hero/waves-web.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* White overlay — dissolves 1 → 0 on entry (matches the light
          AboutValues section above bleeding into the dark video). */}
      <div
        ref={whiteOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40 bg-white"
      />

      <div className="relative z-10 min-h-screen flex items-center px-6 sm:px-10 wide:px-16 py-16 sm:py-20">
        <div className="mx-auto max-w-[1320px] wide:max-w-[1560px] w-full">
          {/* Glass card containing the stats — sits over the clean video
              background. Semi-transparent dark tint + backdrop blur so
              the numbers stay legible without a full-body gradient. */}
          <div className="rounded-3xl border border-white/10 bg-black/45 backdrop-blur-md p-8 sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-12 lg:items-end">
              <div ref={introRef} className="lg:col-span-4">
                <Eyebrow>By the numbers</Eyebrow>
                <h3 className="serif mt-5 text-3xl sm:text-4xl text-ivory-on-dark leading-tight">
                  A studio measured{" "}
                  <span className="serif-italic text-accent">in detail.</span>
                </h3>
              </div>

              <div
                ref={statsRef}
                className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
              >
                {stats.map((s) => (
                  <div key={s.label} data-stat className="flex flex-col gap-2">
                    <span className="serif text-[clamp(44px,5vw,80px)] text-ivory-on-dark leading-none">
                      {s.value}
                    </span>
                    <span className="label text-muted-on-dark">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
