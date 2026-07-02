"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionShell, Eyebrow } from "./ui";

/**
 * AboutStory — the pinned "manifesto" beat. Title only, vertically centered
 * in the viewport, with an inline icon cluster à la the Fluke reference.
 * Description paragraphs live in the follow-up AboutDescription section.
 */
export function AboutStory() {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        if (overlayRef.current) overlayRef.current.style.opacity = "0";
        headingRef.current
          ?.querySelectorAll<HTMLElement>("[data-heading-word]")
          .forEach((w) => (w.style.opacity = "1"));
        return;
      }

      // Dark → light. Overlay holds opaque, then fades to 0 in the last
      // stretch (top 20% → top top) — dark hero fades to white right as
      // this section is about to pin.
      gsap.fromTo(
        overlayRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 20%",
            end: "top top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const headingWords =
          headingRef.current?.querySelectorAll<HTMLSpanElement>(
            "[data-heading-word]",
          );
        if (headingWords?.length) gsap.set(headingWords, { opacity: 0.2 });

        // Pin for 3 viewport-heights of scroll. Scroll 1 reveals the
        // heading. Scrolls 2 & 3 hold the story stationary while the
        // AboutDescription section (positioned with -mt-[100vh]) slides
        // up over it — same slide-over choreography home page uses for
        // IntroStatement → GroupCompanies.
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        // Reveal timeline covers only the first 100% of the pin so the
        // heading is fully lit by the time the description begins its
        // slide-over.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=100%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        if (headingWords?.length) {
          tl.to(
            headingWords,
            {
              opacity: 1,
              ease: "none",
              stagger: { each: 0.03, from: "start" },
              duration: 0.06,
            },
            0,
          );
        }
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-background">
      {/* Dark overlay that fades 1 → 0 as the section's top edge approaches
          the top of the viewport. Colour matches the bottom of the hero. */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50 bg-[#06121f]"
      />

      <SectionShell className="min-h-screen flex flex-col justify-center py-20 sm:py-28 text-center">
        <div className="mx-auto flex justify-center">
          <Eyebrow>Our story</Eyebrow>
        </div>

        <h2
          ref={headingRef}
          className="serif mt-8 sm:mt-10 mx-auto text-[clamp(44px,6.4vw,120px)] leading-[1.02] tracking-[-0.025em] text-balance"
        >
          {"One accountable ecosystem".split(" ").map((w, i) => (
            <Fragment key={`h1-${i}`}>
              <span data-heading-word className="inline-block">
                {w}
              </span>{" "}
            </Fragment>
          ))}
          {/* Single inline image — sized in em so it always tracks the
              text scale. Aria-hidden so screen readers still read the
              sentence cleanly. */}
          <span
            data-heading-word
            aria-hidden="true"
            className="inline-block align-middle translate-y-[-0.06em] mx-[0.12em]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/story.png"
              alt=""
              className="h-[0.72em] w-[1.1em] rounded-[0.15em] object-cover"
              loading="lazy"
              decoding="async"
            />
          </span>{" "}
          {"for the entire EXIM lifecycle.".split(" ").map((w, i) => (
            <Fragment key={`h2-${i}`}>
              <span data-heading-word className="inline-block">
                {w}
              </span>{" "}
            </Fragment>
          ))}
        </h2>
      </SectionShell>
    </div>
  );
}
