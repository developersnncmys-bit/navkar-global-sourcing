"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { logoClients } from "@/lib/content";
import { SectionShell, Eyebrow } from "./ui";

// ────────────────────────────────────────────────────────────────
// Clientele page sections — mirrors the home page's animation
// language: GSAP + ScrollTrigger with scrubbed word-by-word reveals,
// dark/light overlay handoffs, and accent timeline-underline strokes
// that grow left→right as items enter their reveal window.
// ────────────────────────────────────────────────────────────────

const testimonialClients = [
  "RR Global Ltd",
  "Alicon Castalloy Ltd",
  "Ruchi Soya",
  "Piramal Glass Limited",
];

const engagements = [
  { label: "SAD Refund", body: "Recovery of Special Additional Duty paid on imported inputs." },
  { label: "FMS License", body: "Focus Market Scheme benefits for export destinations." },
  { label: "Bond Cancellation", body: "Closure of customs bonds against fulfilled export obligations." },
  { label: "EPCG License", body: "Capital goods imports against future export obligation." },
  { label: "Advance License", body: "Duty-free import of inputs against export commitments." },
];

// ────────────────────────────────────────────────────────────────
// Featured logos — intro reveal + auto-scrolling horizontal
// marquee. Two copies of the logo set sit back-to-back inside the
// track; a `-50%` xPercent tween on infinite repeat lands the
// second copy where the first started, so the loop reads seamless.
// Same technique as ClientsStrip on the home page, inverted for a
// light section. Marquee runs at a constant speed independent of
// scroll; the intro block reveals on scroll and an accent stroke
// under the strip grows left→right as the section enters view.
// ────────────────────────────────────────────────────────────────
export function ClienteleLogos() {
  const rootRef = useRef<HTMLElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Marquee — runs independently of scroll. Two copies of the logo
      // set are rendered below; xPercent -50 lands the second copy at
      // the first copy's start position, so the loop is seamless.
      let marqueeTween: gsap.core.Tween | null = null;
      const track = trackRef.current;
      if (track && !reduced) {
        gsap.set(track, { xPercent: 0 });
        marqueeTween = gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: 30,
          repeat: -1,
        });
      }

      if (reduced) {
        gsap.set(darkOverlayRef.current, { opacity: 0 });
        ScrollTrigger.refresh();
        return () => {
          marqueeTween?.kill();
        };
      }

      const mm = gsap.matchMedia();

      // Dark → white dissolve, timed to the pin approach. The overlay
      // (deep-navy, colour-matched to the hero) sits fully opaque
      // through most of the section's climb up the viewport, then
      // scrubs 1 → 0 only in the last 40% of the approach — so the
      // section reads dark until its top edge is close to the viewport
      // top, then dissolves to the white/ivory beneath right as the
      // pin engages.
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          darkOverlayRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 40%",
              end: "top top",
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      // Pin the section for +=220% of scroll — first ~150% drives the
      // scrubbed word-by-word title/body reveal + strip lift, remaining
      // ~70% is a quiet hold so the marquee has room to breathe and the
      // next section can begin sliding up over the pin tail. Same
      // pin/hold vocabulary IntroStatement uses on the home page.
      mm.add("(min-width: 768px)", () => {
        const titleWords = introRef.current?.querySelectorAll<HTMLElement>("[data-title-word]");
        const bodyWords = introRef.current?.querySelectorAll<HTMLElement>("[data-body-word]");

        if (titleWords?.length) gsap.set(titleWords, { opacity: 0.15 });
        if (bodyWords?.length) gsap.set(bodyWords, { opacity: 0.15 });
        gsap.set(stripRef.current, { opacity: 0, y: 24 });
        gsap.set(lineRef.current, { scaleX: 0 });

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=150%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        if (titleWords?.length) {
          tl.to(
            titleWords,
            {
              opacity: 1,
              ease: "none",
              stagger: { each: 0.02, from: "start" },
              duration: 0.08,
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
              duration: 0.05,
            },
            0.3,
          );
        }
        tl.to(stripRef.current, { opacity: 1, y: 0, ease: "power2.out", duration: 0.2 }, 0.55);
        tl.to(lineRef.current, { scaleX: 1, ease: "power2.out", duration: 0.3 }, 0.6);
      });

      mm.add("(max-width: 767px)", () => {
        // No pin, no scrub on mobile — content visible on paint.
        // Overlay suppressed so the section reads light immediately.
        const titleWords = introRef.current?.querySelectorAll<HTMLElement>("[data-title-word]");
        const bodyWords = introRef.current?.querySelectorAll<HTMLElement>("[data-body-word]");
        gsap.set(darkOverlayRef.current, { opacity: 0 });
        if (titleWords) gsap.set(titleWords, { opacity: 1 });
        if (bodyWords) gsap.set(bodyWords, { opacity: 1 });
        gsap.set(stripRef.current, { opacity: 1, y: 0 });
        gsap.set(lineRef.current, { scaleX: 1 });
      });

      ScrollTrigger.refresh();

      return () => {
        marqueeTween?.kill();
      };
    },
    { scope: rootRef },
  );

  // Marquee is two back-to-back copies of the logo set so the -50%
  // translate seamlessly wraps. Aria-hidden the duplicate.
  const marqueeLogos = [...logoClients, ...logoClients];

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative w-full bg-background overflow-hidden md:min-h-screen md:flex md:items-center"
    >
      {/* Dark bleed overlay — colour-matched to the ClienteleHero's
          bottom gradient. Scrubs 1 → 0 as the section climbs into
          view, so the light Logos section dissolves out of the dark
          hero instead of hard-cutting to white. */}
      <div
        ref={darkOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50 bg-[#06121f]"
      />
      <SectionShell className="py-20 sm:py-24 w-full">
        <div ref={introRef}>
          <Eyebrow>Featured logos</Eyebrow>
          <h2 className="serif mt-6 text-[clamp(28px,3.4vw,48px)] leading-[1.1] tracking-[-0.02em] text-balance max-w-3xl">
            {"Brands we've moved".split(" ").map((w, i) => (
              <Fragment key={`t-${i}`}>
                <span data-title-word className="inline-block">
                  {w}
                </span>{" "}
              </Fragment>
            ))}
            {"across borders.".split(" ").map((w, i) => (
              <Fragment key={`ti-${i}`}>
                <span data-title-word className="inline-block serif-italic text-accent">
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] sm:text-[16px] text-muted leading-relaxed text-pretty">
            {"A selection of the enterprises supported with EXIM advisory, licensing and logistics — from perishables to precision hardware.".split(" ").map((w, i) => (
              <Fragment key={`b-${i}`}>
                <span data-body-word className="inline-block">
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </p>
        </div>

        <div ref={stripRef} className="mt-14 relative">
          {/* Edge fades — mask the loop seam so logos dissolve out to
              the page background rather than hard-cutting off. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent"
          />

          <div className="overflow-hidden border-t border-b border-border py-10 sm:py-14">
            <div
              ref={trackRef}
              className="flex w-max items-center gap-16 sm:gap-24 will-change-transform"
            >
              {marqueeLogos.map((c, i) => (
                <div
                  key={`${c.name}-${i}`}
                  aria-hidden={i >= logoClients.length ? true : undefined}
                  className="shrink-0 flex items-center justify-center"
                >
                  {/* Source PNGs are white-fill (built for dark backgrounds).
                      `brightness(0)` on a light strip flips them to black
                      silhouettes so the marks read cleanly. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.src}
                    alt={i < logoClients.length ? c.name : ""}
                    loading="lazy"
                    decoding="async"
                    style={{ filter: "brightness(0)" }}
                    className="h-10 sm:h-14 w-auto max-w-[180px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Accent stroke under the strip — grows left→right on the
              same scroll window as the intro reveal. Same
              timeline-line motif used across the redesigned sections. */}
          <span
            ref={lineRef}
            aria-hidden
            className="absolute -bottom-px left-0 right-0 h-[2px] bg-accent origin-left pointer-events-none"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </SectionShell>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// Testimonial relationships — dark cinema section. Letterbox bars
// close on pin engagement, a fade-in white veil clears from the
// previous light section, then big serif client names reveal in
// sequence — each with an accent stroke underneath that grows
// left→right. Same motion vocabulary as ClientsStrip on the home
// page.
// ────────────────────────────────────────────────────────────────
export function ClienteleTestimonialRelationships() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const fadeInRef = useRef<HTMLDivElement>(null);
  const fadeOutRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  const titleWords = "Voices on the record.".split(" ");

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const titleSpans = titleRef.current?.querySelectorAll<HTMLElement>("[data-word]");
        const nameRows = namesRef.current?.querySelectorAll<HTMLDivElement>("[data-name]");
        const nameLines = namesRef.current?.querySelectorAll<HTMLSpanElement>("[data-name-line]");

        gsap.set([topBarRef.current, bottomBarRef.current], { height: 0 });
        gsap.set(stageRef.current, { backgroundColor: "#0a1726" });
        gsap.set(fadeInRef.current, { opacity: 1 });
        gsap.set(fadeOutRef.current, { opacity: 0 });
        gsap.set(introRef.current, { opacity: 0, y: 12 });
        if (titleSpans?.length) gsap.set(titleSpans, { opacity: 0.1 });
        if (nameRows?.length) gsap.set(nameRows, { opacity: 0.08, y: 12 });
        if (nameLines?.length) gsap.set(nameLines, { scaleX: 0 });
        if (captionRef.current) gsap.set(captionRef.current, { opacity: 0, y: 12 });

        // Cinema reveal on pin engagement.
        const entryST = {
          trigger: rootRef.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 0.3,
          scrub: 0.6,
          invalidateOnRefresh: true,
        };
        gsap.fromTo(
          [topBarRef.current, bottomBarRef.current],
          { height: 0 },
          { height: "7vh", ease: "sine.inOut", scrollTrigger: entryST },
        );
        gsap.fromTo(
          stageRef.current,
          { backgroundColor: "#0a1726" },
          { backgroundColor: "#040c1a", ease: "sine.inOut", scrollTrigger: entryST },
        );
        gsap.fromTo(
          fadeInRef.current,
          { opacity: 1 },
          { opacity: 0, ease: "sine.inOut", scrollTrigger: entryST },
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * 2.2,
            pin: true,
            pinSpacing: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(introRef.current, { opacity: 1, y: 0, ease: "power2.out", duration: 0.05 });

        if (titleSpans?.length) {
          tl.to(
            titleSpans,
            {
              opacity: 1,
              ease: "none",
              stagger: { each: 0.4 / titleSpans.length, from: "start" },
              duration: 0.4,
            },
            0.08,
          );
        }

        if (nameRows?.length) {
          tl.to(
            nameRows,
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              stagger: { each: 0.14, from: "start" },
              duration: 0.35,
            },
            0.55,
          );
        }
        if (nameLines?.length) {
          tl.to(
            nameLines,
            {
              scaleX: 1,
              ease: "power2.out",
              stagger: { each: 0.14, from: "start" },
              duration: 0.4,
            },
            0.6,
          );
        }

        tl.to(captionRef.current, { opacity: 1, y: 0, ease: "power2.out", duration: 0.15 }, ">-0.05");

        tl.to({}, { duration: 0.15 });

        // Fade to white for a clean handoff into the next light section.
        tl.to(fadeOutRef.current, { opacity: 1, duration: 0.2, ease: "power2.inOut" }, ">");

        return () => tl.kill();
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set([topBarRef.current, bottomBarRef.current], { height: 0 });
        gsap.set(stageRef.current, { backgroundColor: "#040c1a" });
        gsap.set(fadeInRef.current, { opacity: 0 });
        gsap.set(fadeOutRef.current, { opacity: 0 });
        gsap.set(introRef.current, { opacity: 1, y: 0 });
        const titleSpans = titleRef.current?.querySelectorAll<HTMLElement>("[data-word]");
        const nameRows = namesRef.current?.querySelectorAll<HTMLDivElement>("[data-name]");
        const nameLines = namesRef.current?.querySelectorAll<HTMLSpanElement>("[data-name-line]");
        if (titleSpans) gsap.set(titleSpans, { opacity: 1 });
        if (nameRows?.length) gsap.set(nameRows, { opacity: 1, y: 0 });
        if (nameLines?.length) gsap.set(nameLines, { scaleX: 1 });
        if (captionRef.current) gsap.set(captionRef.current, { opacity: 1, y: 0 });
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative w-full md:min-h-screen wide:md:!min-h-[86vh] md:overflow-hidden"
    >
      <div ref={stageRef} className="relative w-full min-h-full overflow-hidden">
        {/* Cinema letterbox bars */}
        <div ref={topBarRef} aria-hidden className="absolute inset-x-0 top-0 bg-black z-30 pointer-events-none" />
        <div ref={bottomBarRef} aria-hidden className="absolute inset-x-0 bottom-0 bg-black z-30 pointer-events-none" />

        {/* Fade-IN and fade-OUT overlays for seamless section handoff. */}
        <div ref={fadeInRef} aria-hidden className="absolute inset-0 bg-white z-50 pointer-events-none" />
        <div ref={fadeOutRef} aria-hidden className="absolute inset-0 bg-white z-40 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1320px] wide:max-w-[1560px] px-6 sm:px-10 wide:px-16 pt-[14vh] pb-[10vh] text-white">
          <div ref={introRef}>
            <span className="label text-accent eyebrow-dot">Testimonial relationships</span>
          </div>

          <h2
            ref={titleRef}
            className="serif mt-6 sm:mt-8 text-[clamp(28px,3.4vw,52px)] leading-[1.1] tracking-[-0.02em] font-bold text-white text-balance max-w-3xl"
          >
            {titleWords.map((w, i) => (
              <span key={i} data-word className="inline-block mr-[0.25em] will-change-[opacity]">
                {w}
              </span>
            ))}
          </h2>

          <div ref={namesRef} className="mt-10 sm:mt-14">
            {testimonialClients.map((c, i) => (
              <div key={c} data-name className="relative group">
                <div className="flex items-baseline justify-between gap-6 py-4 sm:py-5">
                  <h3 className="serif font-semibold text-[clamp(20px,2.4vw,36px)] leading-[1.15] tracking-[-0.015em] text-white">
                    {c}
                  </h3>
                  <span className="label text-white/50 tracking-[0.24em] shrink-0">
                    {String(i + 1).padStart(2, "0")} / {String(testimonialClients.length).padStart(2, "0")}
                  </span>
                </div>
                <span
                  data-name-line
                  aria-hidden
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent origin-left pointer-events-none"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
            ))}
          </div>

          <p
            ref={captionRef}
            className="mt-10 max-w-2xl text-[14px] sm:text-[15px] leading-relaxed text-white/70"
          >
            Public endorsements of Navkar Exim Management Consultancy &amp; Services —
            multi-year mandates that carried through licenses, refunds and bond
            closures.
          </p>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// Recurring mandates — pinned section with a scrubbed word reveal
// on the headline, then a staggered card fade + accent underline
// per mandate. Same "timeline-line" grammar as ProductCategories.
// ────────────────────────────────────────────────────────────────
export function ClienteleEngagements() {
  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const titleWords: { text: string; italic?: boolean }[] = [
    { text: "The" },
    { text: "recurring" },
    { text: "enterprise", italic: true },
    { text: "mandates.", italic: true },
  ];
  const bodyText =
    "Five service lines that anchor most of our long-running client relationships — drawn directly from public testimonials.";

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const titleSpans = titleRef.current?.querySelectorAll<HTMLElement>("[data-word]");
        const bodyWords = bodyRef.current?.querySelectorAll<HTMLElement>("[data-body-word]");
        const cards = gridRef.current?.querySelectorAll<HTMLDivElement>("[data-card]");
        const cardLines = gridRef.current?.querySelectorAll<HTMLSpanElement>("[data-card-line]");

        if (introRef.current) gsap.set(introRef.current, { opacity: 0, y: 20 });
        if (titleSpans?.length) gsap.set(titleSpans, { opacity: 0.12 });
        if (bodyWords?.length) gsap.set(bodyWords, { opacity: 0.12 });
        if (cards?.length) gsap.set(cards, { opacity: 0.1, y: 24 });
        if (cardLines?.length) gsap.set(cardLines, { scaleX: 0 });

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=160%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        tl.to(introRef.current, { opacity: 1, y: 0, ease: "none", duration: 0.05 }, 0);

        if (titleSpans?.length) {
          tl.to(
            titleSpans,
            {
              opacity: 1,
              ease: "none",
              stagger: { each: 0.02, from: "start" },
              duration: 0.06,
            },
            0.06,
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
            0.28,
          );
        }

        if (cards?.length) {
          tl.to(
            cards,
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              stagger: { each: 0.09, from: "start" },
              duration: 0.15,
            },
            0.5,
          );
        }
        if (cardLines?.length) {
          tl.to(
            cardLines,
            {
              scaleX: 1,
              ease: "power2.out",
              stagger: { each: 0.09, from: "start" },
              duration: 0.18,
            },
            0.55,
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
      className="relative w-full bg-background overflow-hidden min-h-screen flex items-center"
    >
      <SectionShell className="py-14 sm:py-16 w-full">
        <div ref={introRef}>
          <Eyebrow>What they ask us for</Eyebrow>
        </div>

        <h2
          ref={titleRef}
          className="serif mt-4 text-[clamp(26px,3.2vw,44px)] leading-[1.1] tracking-[-0.015em] text-balance max-w-[900px]"
        >
          {titleWords.map((w, i) => (
            <Fragment key={i}>
              <span
                data-word
                className={`inline-block${w.italic ? " serif-italic text-accent" : ""}`}
              >
                {w.text}
              </span>{" "}
            </Fragment>
          ))}
        </h2>

        <p
          ref={bodyRef}
          className="mt-4 max-w-2xl text-[14px] sm:text-[15px] text-muted leading-relaxed"
        >
          {bodyText.split(" ").map((w, i) => (
            <Fragment key={i}>
              <span data-body-word className="inline-block">
                {w}
              </span>{" "}
            </Fragment>
          ))}
        </p>

        <div
          ref={gridRef}
          className="mt-8 sm:mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {engagements.map((e, i) => (
            <div
              key={e.label}
              data-card
              className="group relative overflow-hidden rounded-2xl border border-border bg-ivory p-5 sm:p-6 flex flex-col gap-2.5 transition-all duration-500 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_30px_60px_-30px_rgba(11,18,32,0.18)]"
            >
              <div className="flex items-baseline justify-between">
                <span className="label text-muted-2 text-[10px]">
                  Mandate {String(i + 1).padStart(2, "0")}
                </span>
                <span className="label text-muted-2 text-[10px] tracking-[0.24em]">
                  {String(i + 1).padStart(2, "0")}/{String(engagements.length).padStart(2, "0")}
                </span>
              </div>
              <h3 className="serif text-lg sm:text-xl tracking-tight">
                {e.label}
              </h3>
              <p className="text-[13px] text-muted text-pretty leading-relaxed">
                {e.body}
              </p>
              <span
                data-card-line
                aria-hidden
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent origin-left pointer-events-none"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}
