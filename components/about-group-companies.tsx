"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  Landmark,
  Ship,
  Repeat,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { groupCompanies } from "@/lib/content";
import { SectionShell, Eyebrow } from "./ui";

/**
 * AboutGroupCompanies — the four Navkar Global Sourcing entities laid out
 * as circular icon cards over a FIXED shipmentinmind.png background.
 * Content sits in a transparent scrollable region; the background image
 * stays parked as the user scrolls through the section.
 * Slides up over the pinned StatsBand at z-40 with -mt-[100vh].
 */
const cardIcons: LucideIcon[] = [Landmark, Ship, Repeat, Building2];

export function AboutGroupCompanies() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const cards =
          gridRef.current?.querySelectorAll<HTMLDivElement>("[data-card]");
        const lines =
          gridRef.current?.querySelectorAll<HTMLSpanElement>("[data-line]");

        if (introRef.current) gsap.set(introRef.current, { opacity: 0, y: 24 });
        if (cards?.length) gsap.set(cards, { opacity: 0, y: 32 });
        if (lines?.length) gsap.set(lines, { scaleX: 0 });

        // On-enter reveal — non-scrubbed, plays once when section enters.
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
        if (cards?.length) {
          tl.to(
            cards,
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              stagger: { each: 0.12, from: "start" },
              duration: 0.6,
            },
            0.2,
          );
        }
        if (lines?.length) {
          tl.to(
            lines,
            {
              scaleX: 1,
              ease: "power2.out",
              stagger: { each: 0.12, from: "start" },
              duration: 0.6,
            },
            0.3,
          );
        }
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    // -mt-[100vh] + z-40 slides this section up over the pinned section
    // above. Video background parked behind the content; content region
    // is transparent-glass over it.
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative w-full z-40 -mt-[100vh] overflow-hidden bg-[#06121f]"
    >
      {/* Background video — plays under the dark overlay. */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/hero/waveshero-web.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Dark tint over the video so ivory text stays legible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[rgba(6,18,31,0.72)]"
      />

      <SectionShell
        dark
        className="relative min-h-screen flex flex-col justify-center py-14 sm:py-16">
        <div ref={introRef} className="mx-auto max-w-[900px] text-center">
          <Eyebrow>Group of Companies</Eyebrow>
          <h2 className="serif font-black mt-3 text-[clamp(22px,3vw,42px)] leading-[1.15] tracking-[-0.005em] text-ivory-on-dark text-balance">
            Four specialised entities{" "}
            <span className="serif-italic text-accent-soft font-black sm:whitespace-nowrap tracking-normal">
              under one ecosystem.
            </span>
          </h2>
          <p className="mt-3 text-[14px] sm:text-[15px] text-ivory-on-dark/75 leading-relaxed text-pretty max-w-[600px] mx-auto">
            Each company owns a distinct discipline; together they cover the
            entire EXIM lifecycle without a single hand-off.
          </p>
        </div>

        {/* Four transparent-glass circular cards. */}
        <div
          ref={gridRef}
          className="mt-8 sm:mt-10 mx-auto w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {groupCompanies.map((c, i) => {
            const Icon = cardIcons[i] ?? Building2;
            return (
              <div
                key={c.name}
                data-card
                className="group relative flex flex-col items-center text-center pb-5"
              >
                {/* Transparent circular disc with glass tint and accent
                    ring; fills with accent on hover. */}
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent/40 to-accent-soft/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                  />
                  <div className="relative grid place-items-center h-24 w-24 sm:h-28 sm:w-28 rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-md transition-colors duration-500 group-hover:bg-accent group-hover:border-accent">
                    <Icon
                      className="h-8 w-8 sm:h-9 sm:w-9 text-accent-soft transition-colors duration-500 group-hover:text-ivory-on-dark"
                      strokeWidth={1.35}
                    />
                  </div>
                </div>

                <h3 className="serif font-semibold mt-4 text-[13.5px] sm:text-[14px] leading-[1.4] tracking-normal text-ivory-on-dark text-balance">
                  {c.name}
                </h3>
                <p className="mt-2 text-[12px] sm:text-[12.5px] text-ivory-on-dark/70 leading-relaxed text-pretty max-w-[260px]">
                  {c.role}
                </p>

                <span
                  data-line
                  aria-hidden
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] w-20 bg-accent-soft origin-left pointer-events-none"
                  style={{ transform: "translateX(-50%) scaleX(0)" }}
                />
              </div>
            );
          })}
        </div>
      </SectionShell>
    </section>
  );
}
