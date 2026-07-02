"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { testimonials } from "@/lib/content";

export function Testimonials() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // One slide container per testimonial. We grab the word spans via
  // querySelectorAll inside useGSAP — that's far more reliable than the
  // accumulator callback-ref pattern, which was returning empty arrays when
  // React re-rendered and stranding the timeline with no targets (that's
  // why the words sat at full opacity and the carousel never slid).
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = trackRef.current;
      const content = contentRef.current;
      if (!root || !track || !content) return;

      const total = testimonials.length;

      // Re-query word spans live each time the matchMedia callback runs,
      // so we never use a stale empty snapshot (Strict Mode double-mount,
      // re-renders, etc.). Defensive: empty entries get filtered out.
      const queryAllWords = (): HTMLElement[][] =>
        slideRefs.current.map((slide) =>
          slide
            ? Array.from(slide.querySelectorAll<HTMLElement>("[data-word]"))
            : [],
        );

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        queryAllWords()
          .flat()
          .forEach((w) => gsap.set(w, { opacity: 1 }));
        return;
      }

      const mm = gsap.matchMedia();

      // Desktop: pin the section, slide it up over the previous, then scrub
      // through per-quote word reveals + carousel slides. ── PIN UNTOUCHED.
      mm.add("(min-width: 768px)", () => {
        const allWords = queryAllWords();
        // Initial state: words at very low opacity so the brighten-on-scroll
        // is clearly visible. Higher contrast than the prior 0.15.
        allWords.flat().forEach((w) => gsap.set(w, { opacity: 0.08 }));
        gsap.set(track, { xPercent: 0 });

        // Slide-up entry. Tightened from the previous (start "top bottom",
        // end "top top", scrub 1.2) — that was making the content trail the
        // section's white background for the full entry, which read as a
        // "white gap" after ClientsStrip's tail fade-to-white. Now the
        // content settles by the time the section is ~60% of the way up
        // the viewport, with almost no scrub lag.
        const slideST = gsap.fromTo(
          content,
          { yPercent: 60 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "top 40%",
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          },
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            // No trailing buffer. Pin ends exactly when the timeline ends
            // (T3 fully revealed), so ClientsStrip's entry / fade-in
            // begins immediately rather than after a dead-air buffer.
            end: () => "+=" + window.innerHeight * total,
            pin: true,
            pinSpacing: true,
            scrub: 2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 0; i < total; i++) {
          const words = allWords[i];
          if (words.length) {
            tl.to(
              words,
              {
                opacity: 1,
                ease: "none",
                stagger: { each: 1 / words.length, from: "start" },
                duration: 0.05,
              },
              ">",
            );
          }
          tl.to({}, { duration: i === total - 1 ? 1.1 : 0.3 });
          if (i < total - 1) {
            tl.to(track, {
              xPercent: -100 * (i + 1),
              ease: "power2.inOut",
              duration: 0.8,
            });
          }
        }

        // No trailing hold — pin range now matches reveals exactly.

        return () => {
          tl.kill();
          slideST.scrollTrigger?.kill();
        };
      });

      mm.add("(max-width: 767px)", () => {
        queryAllWords()
          .flat()
          .forEach((w) => gsap.set(w, { opacity: 1 }));
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const total = testimonials.length;

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative z-10 bg-background px-6 sm:px-10 wide:px-16 py-20 md:py-0 md:min-h-screen md:flex md:items-center md:pt-[12vh] md:pb-[8vh] md:overflow-hidden"
    >
      {/* Minimal corner chips — section identifier + slide counter. Pulled
          out of the carousel rail and pinned to the section corners so
          they don't compete with the giant editorial quote. */}
      <span className="absolute top-6 sm:top-10 left-6 sm:left-10 label text-ink/70 tracking-[0.28em]">
        Testimonials
      </span>
      <span className="absolute top-6 sm:top-10 right-6 sm:right-10 label text-ink/70 tracking-[0.28em]">
        {String(total).padStart(2, "0")} stories
      </span>

      <div ref={contentRef} className="relative mx-auto max-w-[1200px] wide:max-w-[1440px] w-full">
        {/* Carousel rail */}
        <div className="md:overflow-hidden">
          <div ref={trackRef} className="md:flex max-md:space-y-20">
            {testimonials.map((t, i) => (
              <div
                key={t.company}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className="md:w-full md:shrink-0 md:px-2 md:flex md:items-center"
              >
                <PullQuote
                  index={i}
                  total={total}
                  text={t.quote}
                  attribution={t.company}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PullQuote({
  index,
  total,
  text,
  attribution,
}: {
  index: number;
  total: number;
  text: string;
  attribution: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  const num = String(index + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");

  return (
    <article className="relative mx-auto max-w-[1100px]">
      {/* Editorial quote — bold serif, sized so even the longest testimonial
          fits comfortably inside the section viewport. Touché's reference
          works at huge sizes because the quote is one short tagline; the
          quotes here are 50-80 words, so the clamp is tuned smaller. */}
      <blockquote
        aria-label={text}
        className="serif font-bold text-ink text-center"
        style={{
          fontSize: "clamp(22px, 2.4vw, 40px)",
          lineHeight: 1.22,
          letterSpacing: "-0.015em",
        }}
      >
        <span aria-hidden>&ldquo;</span>
        {words.map((w, i) => (
          <Fragment key={`${w}-${i}`}>
            <span data-word className="inline-block">
              {w}
            </span>{" "}
          </Fragment>
        ))}
        <span aria-hidden>&rdquo;</span>
      </blockquote>

      {/* Minimal attribution — small em-dash byline. Slide counter on the
          right balances it as an editorial signature line. */}
      <figcaption className="relative mt-10 sm:mt-14 flex flex-wrap items-center justify-between gap-3">
        <div className="serif text-[clamp(15px,1.4vw,20px)] text-ink">
          &mdash;&nbsp;&nbsp;{attribution}
        </div>
        <div className="label text-ink/60 tracking-[0.24em]">
          {num} / {totalStr}
        </div>
      </figcaption>
    </article>
  );
}
