"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  ShieldCheck,
  Compass,
  ScrollText,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow, SectionShell } from "./ui";

const values: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "Regulatory honesty",
    body: "We stay literal about FTP, customs and PGA — no shortcuts that surface later as delays or demand notices.",
  },
  {
    icon: Compass,
    title: "Named accountability",
    body: "A senior partner owns every mandate end-to-end. No handoffs between advisory, licensing and execution.",
  },
  {
    icon: ScrollText,
    title: "Documented rigour",
    body: "Every shipment carries an auditable trail — classifications, valuations, licence usage, correspondence.",
  },
  {
    icon: Handshake,
    title: "Long-form relationships",
    body: "Most of our clients have been with the group for a decade or more. That's the outcome we design for.",
  },
];

export function AboutValues() {
  const rootRef = useRef<HTMLElement>(null);
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
        const cells =
          gridRef.current?.querySelectorAll<HTMLDivElement>("[data-cell]");
        const lines =
          gridRef.current?.querySelectorAll<HTMLSpanElement>("[data-line]");

        if (introRef.current) gsap.set(introRef.current, { opacity: 0, y: 24 });
        if (cells?.length) gsap.set(cells, { opacity: 0.15, y: 18 });
        if (lines?.length) gsap.set(lines, { scaleX: 0 });

        // Pin the section once it fully lands at the top of the viewport.
        // Holds for +=350% — 100% for the scrubbed reveal + 250% dwell so
        // the reader has time to take in the four principles before the
        // next section (AboutGroupCompanies) slides up over it.
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=350%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        // Reveal timeline scrubs across only the first 100% of the pin
        // so the grid is fully lit by the time the dwell starts.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=100%",
            scrub: 0.8,
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
        if (cells?.length) {
          tl.to(
            cells,
            {
              opacity: 1,
              y: 0,
              ease: "power1.out",
              stagger: { each: 0.1, from: "start" },
              duration: 0.35,
            },
            0.22,
          );
        }
        if (lines?.length) {
          tl.to(
            lines,
            {
              scaleX: 1,
              ease: "power2.out",
              stagger: { each: 0.1, from: "start" },
              duration: 0.4,
            },
            0.25,
          );
        }

        return () => tl.kill();
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    // -mt-[100vh] + z-10 parks this section BEHIND the pinned blue
    // AboutDescription (z-20). Blue covers it visually while its pin
    // holds. When the blue pin releases and it naturally scrolls up
    // off the top, this white section is REVEALED underneath — the
    // "blue slides up, white already there" reveal pattern.
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative w-full bg-background z-10 -mt-[100vh] overflow-hidden"
    >
      <SectionShell className="min-h-screen flex flex-col justify-center py-16 sm:py-20">
        {/* Intro — vertically centered above the grid inside the viewport. */}
        <div ref={introRef} className="mx-auto max-w-[900px] text-center">
          <Eyebrow>What we stand for</Eyebrow>
          <h2 className="serif font-black mt-4 text-[clamp(28px,3.4vw,48px)] leading-[1.05] tracking-[-0.025em] text-foreground text-balance">
            Four principles{" "}
            <span className="serif-italic text-accent font-black whitespace-nowrap">
              that shape the practice.
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] text-muted leading-relaxed text-pretty max-w-[600px] mx-auto">
            The commitments behind every mandate — how we work, and why our
            clients stay for decades.
          </p>
        </div>

        {/* Hairline grid — 4 cells, GSAP scrub reveal per cell with an
            accent timeline-line growing left → right at the bottom. Same
            motion vocabulary as ProductCategories on the home page. */}
        <div
          ref={gridRef}
          className="mt-10 sm:mt-12 mx-auto w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-border"
        >
          {values.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              data-cell
              className="group relative border-r border-b border-border p-6 sm:p-7 flex flex-col items-center text-center gap-3 min-h-[210px] sm:min-h-[220px] transition-colors duration-500 hover:bg-ivory"
            >
              {/* Accent timeline line that grows left → right on scroll. */}
              <span
                data-line
                aria-hidden
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left pointer-events-none"
                style={{ transform: "scaleX(0)" }}
              />

              {/* Icon in an accent-tinted circle for a bit more presence
                  than a bare stroke icon. */}
              <span className="grid place-items-center h-11 w-11 rounded-full bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-ivory-on-dark">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>

              <span className="text-[14px] sm:text-[15px] font-medium text-ink leading-tight">
                {title}
              </span>
              <p className="text-[12.5px] sm:text-[13px] text-muted leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}
