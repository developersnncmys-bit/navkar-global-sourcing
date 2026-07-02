"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { plans } from "@/lib/content";
import { SectionShell, Eyebrow } from "./ui";

const bodySegments: { text: string; italic?: boolean }[] = [
  { text: "The four plans read like a spectrum —" },
  { text: "from" },
  { text: "hand-off simple to full custom engagement", italic: true },
  { text: "— so we can meet you exactly where you are in the sourcing arc without pretending one shape fits every trade." },
];

/**
 * Services philosophy band — the "how the plans work" beat between the
 * dark hero and the dark plans grid. Mirrors the home IntroStatement
 * choreography:
 *   1. A dark overlay covers the section as it climbs the viewport, then
 *      dissolves 1 → 0 as the top edge reaches the top of the viewport.
 *      Smooth dark → light seam between /services hero and this section.
 *   2. On pin, a single scrubbed timeline word-reveals the headline, then
 *      the body, then fades in the plans strip at the bottom.
 * Honors prefers-reduced-motion.
 */
export function ServicesPhilosophy() {
  const rootRef = useRef<HTMLElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        if (darkOverlayRef.current) darkOverlayRef.current.style.opacity = "0";
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const words = headlineRef.current?.querySelectorAll<HTMLSpanElement>(
          "[data-word]",
        );
        const bodyWords = bodyRef.current?.querySelectorAll<HTMLSpanElement>(
          "[data-body-word]",
        );
        const chips = stripRef.current?.querySelectorAll<HTMLDivElement>(
          "[data-chip]",
        );

        gsap.set(darkOverlayRef.current, { opacity: 1 });
        if (words?.length) gsap.set(words, { opacity: 0.15 });
        if (bodyWords?.length) gsap.set(bodyWords, { opacity: 0.15 });
        if (chips?.length) gsap.set(chips, { opacity: 0, y: 22 });

        // Dark → light overlay dissolve on entry (matches IntroStatement).
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

        // Pin the section for the reveal + a short hold.
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=260%",
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        });

        // Scrub reveal — headline first, then body, then plans strip.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=160%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

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

        if (bodyWords?.length) {
          tl.to(
            bodyWords,
            {
              opacity: 1,
              ease: "none",
              stagger: { each: 0.008, from: "start" },
              duration: 0.04,
            },
            0.3,
          );
        }

        if (chips?.length) {
          tl.to(
            chips,
            {
              opacity: 1,
              y: 0,
              ease: "none",
              stagger: { each: 0.08, from: "start" },
              duration: 0.1,
            },
            0.62,
          );
        }
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative z-10 overflow-hidden bg-background min-h-[80vh] wide:!min-h-[68vh]"
    >
      {/* Dark overlay — mirrors IntroStatement seam handoff. */}
      <div
        ref={darkOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50 bg-[#06121f]"
      />

      <SectionShell className="pt-16 sm:pt-24 pb-16 sm:pb-24">
        <Eyebrow>The four-plan model</Eyebrow>

        <h2
          ref={headlineRef}
          className="serif mt-8 text-[clamp(28px,3.6vw,58px)] leading-[1.3] max-w-[1300px]"
        >
          <span data-word className="inline-block">One</span>{" "}
          <span data-word className="inline-block">accountable</span>{" "}
          <span data-word className="inline-block">desk,</span>{" "}
          <span data-word className="inline-block serif-italic text-accent">four</span>{" "}
          <span data-word className="inline-block serif-italic text-accent">shapes</span>{" "}
          <span data-word className="inline-block serif-italic text-accent">of</span>{" "}
          <span data-word className="inline-block serif-italic text-accent">engagement</span>
          <br />
          <span data-word className="inline-block">— matched</span>{" "}
          <span data-word className="inline-block">to</span>{" "}
          <span data-word className="inline-block">where</span>{" "}
          <span data-word className="inline-block">the</span>{" "}
          <span data-word className="inline-block">supplier</span>{" "}
          <span data-word className="inline-block">already</span>{" "}
          <span data-word className="inline-block">sits.</span>
        </h2>

        <div
          ref={bodyRef}
          className="mt-8 sm:mt-10 grid gap-8 lg:grid-cols-12 lg:items-end"
        >
          <p className="lg:col-span-8 text-[16px] sm:text-[17px] text-muted max-w-3xl leading-relaxed">
            {bodySegments.flatMap((seg, segI) =>
              seg.text.split(" ").map((w, wI) => (
                <Fragment key={`${segI}-${wI}`}>
                  <span
                    data-body-word
                    className={`inline-block${
                      seg.italic ? " serif-italic text-foreground" : ""
                    }`}
                  >
                    {w}
                  </span>{" "}
                </Fragment>
              )),
            )}
          </p>
          <div className="lg:col-span-4 flex lg:justify-end">
            <span className="label text-muted-2">
              {String(plans.length).padStart(2, "0")} · plans on offer
            </span>
          </div>
        </div>

        {/* Plans strip — cross-section jump list of the four plan names. */}
        <div
          ref={stripRef}
          className="mt-14 sm:mt-16 border-t border-border pt-8 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {plans.map((plan, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <a
                key={plan.slug}
                href={`#${plan.slug}`}
                data-chip
                className="group flex flex-col gap-3"
              >
                <span className="label text-muted-2">Plan {num}</span>
                <h3 className="serif text-2xl sm:text-[28px] leading-[1.05] text-foreground transition-colors duration-500 group-hover:text-accent">
                  {plan.name}
                </h3>
                <p className="serif-italic text-sm text-accent leading-snug">
                  {plan.tagline}
                </p>
              </a>
            );
          })}
        </div>
      </SectionShell>
    </section>
  );
}

export default ServicesPhilosophy;
