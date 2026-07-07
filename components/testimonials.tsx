"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { testimonials } from "@/lib/content";

// One imagery panel per testimonial, curated from Pexels to match each
// client's industry:
//   0 → RR Global Ltd       — cargo containers at port (global trading)
//   1 → Alicon Castalloy Ltd — molten metal pour in a foundry
//                              (they're an aluminum-casting auto-parts firm)
//   2 → Ruchi Soya          — soybean field (edible-oil / agri commodity)
// Replace with real client photography or logos when they're available.
const panelImages = [
  "https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/6804258/pexels-photo-6804258.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/2889412/pexels-photo-2889412.jpeg?auto=compress&cs=tinysrgb&w=900",
];

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
      className="relative z-10 bg-background px-4 sm:px-6 md:px-10 wide:px-14 py-14 md:py-0 md:min-h-screen md:flex md:items-center md:overflow-hidden"
    >
      <div
        ref={contentRef}
        className="relative mx-auto max-w-[1440px] wide:max-w-[1620px] w-full"
      >
        {/* Content sits directly on the section background — the earlier
            rounded ivory panel + drop shadow have been removed per design
            request. Only the padding stays for breathing room. */}
        <div className="relative px-2 sm:px-4 lg:px-6 pt-6 sm:pt-8 pb-6 sm:pb-8">
          {/* -------- TOP ROW: eyebrow + heading + description (left)
              and a small download-app-style tag (right). -------- */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
            <div className="max-w-[640px]">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] uppercase text-black/55">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                What clients say
              </span>
              <h2
                className="serif font-bold mt-3 text-black text-balance"
                style={{
                  fontSize: "clamp(28px, 3vw, 50px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                Reviews from our clients
              </h2>
              <p className="mt-4 text-[13.5px] sm:text-[14.5px] leading-[1.55] text-black/55 max-w-[520px] text-pretty">
                Twenty-five years of consignments cleared under DGFT, customs
                and PGA. Here&apos;s what the exporters and importers who
                trust our desk have said about the work.
              </p>
            </div>

          </div>

          {/* -------- CAROUSEL ROW: prev arrow · carousel rail · next arrow -------- */}
          <div className="mt-10 sm:mt-14 flex items-center gap-4 sm:gap-6">
            {/* Prev arrow — decorative on md+ (scroll drives the actual
                slide changes). Kept as an on-screen affordance for the
                reader; the pin/scroll timeline already advances the track. */}
            <button
              type="button"
              aria-label="Previous testimonial"
              className="hidden md:grid place-items-center h-11 w-11 rounded-full bg-black text-white shrink-0 hover:bg-accent transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="flex-1 min-w-0 md:overflow-hidden">
              <div ref={trackRef} className="md:flex max-md:space-y-12">
                {testimonials.map((t, i) => (
                  <div
                    key={t.company}
                    ref={(el) => {
                      slideRefs.current[i] = el;
                    }}
                    className="md:w-full md:shrink-0"
                  >
                    <PullQuote
                      index={i}
                      total={total}
                      text={t.quote}
                      attribution={t.company}
                      image={panelImages[i] ?? panelImages[0]}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              aria-label="Next testimonial"
              className="hidden md:grid place-items-center h-11 w-11 rounded-full bg-black text-white shrink-0 hover:bg-accent transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          {/* -------- BOTTOM ROW: CTAs (left) + tag (right) -------- */}
          <div className="mt-10 sm:mt-14 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <a
                href="/clientele"
                className="group inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-2.5 text-[13px] font-semibold transition-colors hover:bg-accent"
              >
                See all clients
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-black/20 text-black px-5 py-2.5 text-[13px] font-semibold transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                Share yours
              </a>
            </div>

            <div className="text-[12.5px] leading-tight text-black/60 sm:text-right">
              <span>Trusted across textiles, jewellery, agri and more.</span>
              <span className="mx-1.5 text-black/25">·</span>
              <span className="font-semibold text-black">Est. 2000 · Mumbai</span>
            </div>
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
  image,
}: {
  index: number;
  total: number;
  text: string;
  attribution: string;
  image: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  const num = String(index + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");

  return (
    <article className="relative w-full grid gap-6 md:grid-cols-[minmax(220px,320px)_1fr] md:gap-10 lg:gap-14 md:items-stretch">
      {/* -------- LEFT: industry-relevant portrait image, sits where the
          reference card places the person photo. -------- */}
      <div className="relative shrink-0">
        <div className="relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-auto md:h-full min-h-[280px] bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={`${attribution} — client context`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Soft bottom scrim so the corner tag reads on any photo. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,18,32,0) 40%, rgba(11,18,32,0.5) 100%)",
            }}
          />
          {/* Top-right corner tag — "Client" chip. */}
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/12 backdrop-blur-sm px-2.5 py-1 text-[9px] font-semibold tracking-[0.22em] uppercase text-white ring-1 ring-white/20">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
            Client
          </span>
        </div>

        {/* Name + verified stamp + rating under the image, mirrors the
            reference's "Emily Thompson / emily@... / grade" caption. The
            rating lives here (not in the right column) so it stays tied
            to the current card's image and doesn't visually drift onto
            the next card during scroll transitions. */}
        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div
              className="serif font-bold text-black leading-tight truncate"
              style={{ fontSize: "clamp(16px, 1.35vw, 20px)" }}
            >
              {attribution}
            </div>
            <div className="mt-1 font-mono text-[10px] tracking-[0.22em] uppercase text-black/50">
              Verified client
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-black/45">
              Grade
            </span>
            <div className="flex items-center gap-1.5">
              <span className="serif font-bold text-black text-[14px] tabular-nums">
                5.0
              </span>
              <div aria-hidden className="flex items-center gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.5l2.9 6.5 7.1.7-5.3 4.7 1.6 6.9L12 17.6 5.7 21.3l1.6-6.9L2 9.7l7.1-.7L12 2.5z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------- RIGHT: quote body + counter -------- */}
      <div className="relative flex flex-col">
        {/* Top row: chapter label only (rating moved under the image so
            it stays with the current card during scroll transitions). */}
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-black/50">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          Testimonial · Chapter {num}
        </div>

        <div className="mt-4 h-px w-full bg-black/[0.08]" />

        {/* Quote body — data-word spans preserved for the GSAP timeline. */}
        <blockquote
          aria-label={text}
          className="relative mt-5 serif font-medium text-black text-left text-pretty flex-1"
          style={{
            fontSize: "clamp(14.5px, 1.15vw, 19px)",
            lineHeight: 1.55,
            letterSpacing: "-0.005em",
          }}
        >
          <span
            aria-hidden="true"
            className="serif font-black text-accent/60 mr-1"
            style={{ fontSize: "clamp(22px, 1.8vw, 32px)", lineHeight: 0 }}
          >
            &ldquo;
          </span>
          {words.map((w, i) => (
            <Fragment key={`${w}-${i}`}>
              <span data-word className="inline-block">
                {w}
              </span>{" "}
            </Fragment>
          ))}
        </blockquote>

        {/* Bottom: slide counter */}
        <div className="mt-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-black/[0.06]" />
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-black/40 tabular-nums">
            {num} <span className="text-black/25">/</span> {totalStr}
          </span>
        </div>
      </div>
    </article>
  );
}
