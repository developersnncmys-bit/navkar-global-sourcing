"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionShell, Eyebrow } from "./ui";

/**
 * AboutDescription — the blue follow-up beat that SLIDES UP over the pinned
 * AboutStory during scrolls 2 & 3 of the story's pin, then pins itself on
 * the third scroll and reveals the two welcome paragraphs word-by-word.
 *
 * Positioning uses -mt-[100vh] + z-20 so the section overlaps the bottom
 * of AboutStory in normal document flow — mirrors the home-page technique
 * used for GroupCompanies sliding over IntroStatement.
 */
export function AboutDescription({
  welcome,
  welcomeSecond,
}: {
  welcome: string;
  welcomeSecond: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        bodyRef.current
          ?.querySelectorAll<HTMLElement>("[data-body-word]")
          .forEach((w) => (w.style.opacity = "1"));
        return;
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const bodyWords = bodyRef.current?.querySelectorAll<HTMLSpanElement>(
          "[data-body-word]",
        );
        if (bodyWords?.length) gsap.set(bodyWords, { opacity: 0.2 });

        // Reveal — fires once when the section enters view.
        // Non-scrubbed because there's no pin to anchor a scrub window.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });

        if (bodyWords?.length) {
          tl.to(
            bodyWords,
            {
              opacity: 1,
              ease: "power2.out",
              stagger: { each: 0.008, from: "start" },
              duration: 0.4,
            },
            0,
          );
        }
      });
    },
    { scope: rootRef },
  );

  return (
    // -mt-[100vh] + z-20 lets this section slide up over the pinned
    // AboutStory during scrolls 2 & 3 of that section's 300% pin.
    // The SectionShell inside owns `data-nav-theme="dark"` (via the
    // `dark` prop) so the navbar picks up the theme when the visible
    // blue content is actually behind it.
    <div
      ref={rootRef}
      className="relative z-20 -mt-[100vh] overflow-hidden"
      style={{ backgroundColor: "#001658" }}
    >
      {/* Background video — plays under the blue tint overlay. */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/hero/about-story-web.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Blue tint over the video — kept subtle so the video reads through
          while the section still feels ocean-blue and text stays legible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: "rgba(0, 22, 88, 0.4)" }}
      />

      {/* Extra dim behind the text block only, so ivory copy stays crisp
          without darkening the whole video. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 55%, rgba(0, 22, 88, 0.35) 0%, rgba(0, 22, 88, 0.15) 45%, transparent 75%)",
        }}
      />

      <SectionShell
        dark
        className="relative min-h-screen flex flex-col justify-center py-14 sm:py-24"
        style={{ backgroundColor: "transparent" }}
      >
        <Eyebrow>The story in detail</Eyebrow>

        <div
          ref={bodyRef}
          className="mt-6 sm:mt-10 mx-auto max-w-[1200px] space-y-5 sm:space-y-6 text-[clamp(15px,1.6vw,26px)] leading-[1.5] sm:leading-[1.4] tracking-[-0.005em] text-ivory-on-dark text-balance"
        >
          <p>
            {welcome.split(" ").map((w, i) => (
              <Fragment key={`a-${i}`}>
                <span data-body-word className="inline-block">
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <p className="text-ivory-on-dark/75">
            {welcomeSecond.split(" ").map((w, i) => (
              <Fragment key={`b-${i}`}>
                <span data-body-word className="inline-block">
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </p>
        </div>
      </SectionShell>
    </div>
  );
}
