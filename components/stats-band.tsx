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
  const introRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const statEls =
          statsRef.current?.querySelectorAll<HTMLDivElement>("[data-stat]");

        if (introRef.current) gsap.set(introRef.current, { opacity: 0, y: 24 });
        if (statEls?.length) gsap.set(statEls, { opacity: 0, y: 40 });

        // On-enter reveal — intro fades in, then each stat pops in
        // sequence. Non-scrubbed because there's no pin to anchor the
        // scrub window against.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });

        if (introRef.current) {
          tl.to(
            introRef.current,
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.6 },
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
              stagger: { each: 0.15, from: "start" },
              duration: 0.6,
            },
            0.3,
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

      <div className="relative z-10 min-h-screen flex items-center px-5 sm:px-10 wide:px-16 py-14 sm:py-20">
        <div className="mx-auto max-w-[1320px] wide:max-w-[1560px] w-full">
          {/* Glass card containing the stats — sits over the clean video
              background. Semi-transparent dark tint + backdrop blur so
              the numbers stay legible without a full-body gradient. */}
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-black/45 backdrop-blur-md p-5 sm:p-10 lg:p-12">
            <div className="grid gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-12 lg:items-end">
              <div ref={introRef} className="lg:col-span-4">
                <Eyebrow>By the numbers</Eyebrow>
                <h3 className="serif mt-4 sm:mt-5 text-2xl sm:text-4xl text-ivory-on-dark leading-tight">
                  A studio measured{" "}
                  <span className="serif-italic text-accent">in detail.</span>
                </h3>
              </div>

              <div
                ref={statsRef}
                className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 sm:gap-8 lg:gap-10"
              >
                {stats.map((s) => (
                  <div key={s.label} data-stat className="flex flex-col gap-1.5 sm:gap-2">
                    <span className="serif text-[clamp(32px,5vw,80px)] text-ivory-on-dark leading-none">
                      {s.value}
                    </span>
                    <span className="label text-[10px] sm:text-[11px] text-muted-on-dark">{s.label}</span>
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
