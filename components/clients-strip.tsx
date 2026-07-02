"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { logoClients } from "@/lib/content";

/**
 * Clients showcase — cinema reveal.
 *
 * As the section enters the viewport, two letterbox bars close in from
 * the top and bottom edges and the background fades to pure black —
 * "cinema mode". Once pinned, the title and description reveal word by
 * word, scrubbed against scroll progress (each word fades from faint
 * to full white as you scroll). Finally the logo strip cross-fades in
 * and auto-scrolls horizontally on a continuous loop, independent of
 * scroll position.
 */
const TITLE = "Trusted by the brands that keep global trade moving.";
const DESCRIPTION =
  "From perishables to capital equipment, we've supported 100+ MNCs, corporates and MSMEs with end-to-end EXIM advisory, licensing and logistics — quietly and on the record.";

export function ClientsStrip() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Pure-white screen that scrubs in at the tail of the pin so the
  // section dissolves to white — a classic cinema "fade-to-white" exit.
  const fadeOutRef = useRef<HTMLDivElement>(null);
  // Pure-white screen for the ENTRY — starts at opacity 1 (covers the
  // whole stage), scrubs to 0 as the section approaches the viewport top.
  // Smooths the handoff from the white Testimonials section so the dark
  // cinema mode dissolves IN rather than cutting in.
  const fadeInRef = useRef<HTMLDivElement>(null);

  const titleWords = TITLE.split(" ");
  const descWords = DESCRIPTION.split(" ");

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const titleSpans =
        titleRef.current?.querySelectorAll<HTMLElement>("[data-word]");
      const descSpans =
        descRef.current?.querySelectorAll<HTMLElement>("[data-word]");

      // ----------------------------------------------------------------
      // Marquee — runs independently of scroll. Two copies of the logo
      // set sit back-to-back; xPercent: -50 lands the second copy where
      // the first started, so the loop is seamless.
      // ----------------------------------------------------------------
      const track = trackRef.current;
      let marqueeTween: gsap.core.Tween | null = null;
      if (track) {
        gsap.set(track, { xPercent: 0 });
        marqueeTween = gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: 40,
          repeat: -1,
        });
      }

      if (reduced) {
        if (titleSpans) gsap.set(titleSpans, { opacity: 1 });
        if (descSpans) gsap.set(descSpans, { opacity: 1 });
        gsap.set(
          [topBarRef.current, bottomBarRef.current],
          { height: "8vh" },
        );
        gsap.set(stageRef.current, { backgroundColor: "#000" });
        gsap.set(marqueeRef.current, { opacity: 1 });
        gsap.set(fadeOutRef.current, { opacity: 0 });
        gsap.set(fadeInRef.current, { opacity: 0 });
        ScrollTrigger.refresh();
        return () => {
          marqueeTween?.kill();
        };
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Initial state: bars closed, content faint, marquee hidden.
        gsap.set([topBarRef.current, bottomBarRef.current], { height: 0 });
        gsap.set(stageRef.current, { backgroundColor: "#0a1726" }); // matches espresso
        if (titleSpans) gsap.set(titleSpans, { opacity: 0.12 });
        if (descSpans) gsap.set(descSpans, { opacity: 0.12 });
        gsap.set(eyebrowRef.current, { opacity: 0, y: 12 });
        // Marquee is faint but already present from the start so the
        // bottom of the stage never reads as empty — it gains opacity as
        // the timeline progresses.
        gsap.set(marqueeRef.current, { opacity: 0.25, y: 0 });
        // White fade-out overlay starts invisible; scrubs to full white
        // at the tail of the pin to dissolve the section into the next.
        gsap.set(fadeOutRef.current, { opacity: 0 });
        // White fade-IN overlay starts opaque (matching the white
        // Testimonials section above) and scrubs out as the section
        // approaches the viewport top, dissolving the dark cinema in.
        gsap.set(fadeInRef.current, { opacity: 1 });

        // -------------------------------------------------------------
        // Cinema reveal — tied to PIN ENGAGEMENT (not entry). The section
        // sits fully white during the climb up the viewport, then the
        // moment the pin locks at "top top" the bars close, stage darkens
        // and the white veil clears. Tight 30vh scrub window so it lands
        // as a "curtain rise on pin," not a slow wash during scroll.
        // -------------------------------------------------------------
        const entrySTConfig = {
          trigger: rootRef.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 0.3,
          scrub: 0.6,
          invalidateOnRefresh: true,
        };
        gsap.fromTo(
          [topBarRef.current, bottomBarRef.current],
          { height: 0 },
          { height: "8vh", ease: "sine.inOut", scrollTrigger: entrySTConfig },
        );
        gsap.fromTo(
          stageRef.current,
          { backgroundColor: "#0a1726" },
          {
            backgroundColor: "#000000",
            ease: "sine.inOut",
            scrollTrigger: entrySTConfig,
          },
        );
        gsap.fromTo(
          fadeInRef.current,
          { opacity: 1 },
          { opacity: 0, ease: "sine.inOut", scrollTrigger: entrySTConfig },
        );

        // -------------------------------------------------------------
        // Pin + scrubbed word reveal timeline. By the time the pin
        // engages, the cinema reveal above has already landed, so the
        // pin timeline starts straight into the content reveals.
        // -------------------------------------------------------------
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * 3.2,
            pin: true,
            pinSpacing: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Eyebrow appears the moment the pin engages.
        tl.to(eyebrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.05,
          ease: "power2.out",
        });

        // Title — each word brightens from 0.12 → 1 in sequence.
        if (titleSpans?.length) {
          tl.to(
            titleSpans,
            {
              opacity: 1,
              duration: 0.4,
              ease: "none",
              stagger: { each: 0.4 / titleSpans.length, from: "start" },
            },
            0.08,
          );
        }

        // Description — same pattern, picks up after the title.
        if (descSpans?.length) {
          tl.to(
            descSpans,
            {
              opacity: 0.85,
              duration: 0.35,
              ease: "none",
              stagger: { each: 0.35 / descSpans.length, from: "start" },
            },
            0.52,
          );
        }

        // Marquee gains full opacity alongside the description tail so it's
        // visible during the read, not held back to the end.
        tl.to(
          marqueeRef.current,
          { opacity: 1, duration: 0.25, ease: "power2.out" },
          0.55,
        );

        // Brief quiet beat so the marquee isn't cut off mid-stride before
        // the fade-to-white kicks in.
        tl.to({}, { duration: 0.04 });

        // Cinema fade-to-white — short and snappy so the seam into the
        // Testimonials section feels tight. Previous values (0.1 hold +
        // 0.6 fade) translated to ~1.6 viewports of empty white before
        // the next section entered; this collapses that to ~0.4.
        tl.to(
          fadeOutRef.current,
          { opacity: 1, duration: 0.18, ease: "power2.inOut" },
          ">",
        );

        return () => tl.kill();
      });

      mm.add("(max-width: 767px)", () => {
        // No pin, no scrub. Static dark section, all content visible.
        gsap.set([topBarRef.current, bottomBarRef.current], { height: 0 });
        gsap.set(stageRef.current, { backgroundColor: "#000000" });
        if (titleSpans) gsap.set(titleSpans, { opacity: 1 });
        if (descSpans) gsap.set(descSpans, { opacity: 1 });
        gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
        gsap.set(marqueeRef.current, { opacity: 1, y: 0 });
        gsap.set(fadeOutRef.current, { opacity: 0 });
        gsap.set(fadeInRef.current, { opacity: 0 });
      });

      ScrollTrigger.refresh();
      return () => {
        marqueeTween?.kill();
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative w-full md:h-screen md:overflow-hidden"
    >
      {/* Stage — bg animates from espresso to pure black as we enter */}
      <div
        ref={stageRef}
        className="relative w-full h-full overflow-hidden"
      >
        {/* Cinema letterbox bars */}
        <div
          ref={topBarRef}
          aria-hidden
          className="absolute inset-x-0 top-0 bg-black z-30 pointer-events-none"
        />
        <div
          ref={bottomBarRef}
          aria-hidden
          className="absolute inset-x-0 bottom-0 bg-black z-30 pointer-events-none"
        />

        {/* Fade-IN screen — covers the stage on entry so the section
            dissolves cleanly out of the previous white section. Sits at
            z-50, above the fade-out, so it always wins during entry. */}
        <div
          ref={fadeInRef}
          aria-hidden
          className="absolute inset-0 bg-white z-50 pointer-events-none"
        />

        {/* Fade-to-white screen — sits above the letterbox bars so the
            section dissolves cleanly to pure white as the pin tails off. */}
        <div
          ref={fadeOutRef}
          aria-hidden
          className="absolute inset-0 bg-white z-40 pointer-events-none"
        />

        <div className="relative z-10 mx-auto max-w-[1320px] wide:max-w-[1560px] h-full px-6 sm:px-10 wide:px-16 pt-[11vh] pb-[11vh] flex flex-col text-white">
          {/* Text block — flex-1 keeps it growing into the available room
              between the two letterbox bars without crowding the marquee. */}
          <div className="flex-1 min-h-0 flex flex-col justify-center max-w-5xl">
            <div ref={eyebrowRef}>
              <span className="label text-accent eyebrow-dot">
                Our clientele
              </span>
            </div>

            <h2
              ref={titleRef}
              className="serif mt-6 sm:mt-8 text-[clamp(32px,4.5vw,68px)] leading-[1.08] tracking-[-0.02em] font-bold text-white"
            >
              {titleWords.map((w, i) => (
                <span
                  key={i}
                  data-word
                  className="inline-block mr-[0.25em] will-change-[opacity]"
                >
                  {w}
                </span>
              ))}
            </h2>

            <p
              ref={descRef}
              className="mt-6 sm:mt-8 text-[clamp(15px,1.3vw,19px)] leading-[1.65] max-w-3xl text-white"
            >
              {descWords.map((w, i) => (
                <span
                  key={i}
                  data-word
                  className="inline-block mr-[0.25em] will-change-[opacity]"
                >
                  {w}
                </span>
              ))}
            </p>
          </div>

          {/* Auto-scrolling logo marquee — pinned to the bottom of the stage */}
          <div
            ref={marqueeRef}
            className="relative mt-8 shrink-0 overflow-hidden"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-32 bg-gradient-to-r from-black to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-32 bg-gradient-to-l from-black to-transparent"
            />

            <div
              ref={trackRef}
              className="flex w-max items-center gap-14 sm:gap-20 py-6 will-change-transform"
            >
              {[...logoClients, ...logoClients].map((c, i) => (
                <div
                  key={`${c.name}-${i}`}
                  className="shrink-0 flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.src}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    style={{ filter: "brightness(0) invert(1)" }}
                    className="h-10 sm:h-12 w-auto max-w-[160px] object-contain opacity-80"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
