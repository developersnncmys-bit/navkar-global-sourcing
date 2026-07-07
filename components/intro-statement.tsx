"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { stats } from "@/lib/content";
import { CTAButton } from "./ui";

const bodySegments: { text: string; italic?: boolean }[] = [
  { text: "Navkar Global Sourcing is a Mumbai studio shaping export-import practice with" },
  { text: "restraint, regulatory honesty", italic: true },
  { text: "and a devotion to detail — every consignment tuned to the FTP, customs and PGA conditions that decide whether it sails on time." },
];

export function IntroStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();

      // Desktop: section sits in normal document flow (no slide-up over the
      // hero). As it enters the viewport, a dark overlay fades from 1 → 0
      // so the section reads as dark on entry and as light by the time its
      // top edge reaches the viewport top, where it pins. While pinned, a
      // single scrubbed timeline drives the headline word-reveal and the
      // per-stat reveal so they share one source of truth.
      mm.add("(min-width: 768px)", () => {
        const words = headlineRef.current?.querySelectorAll<HTMLSpanElement>(
          "[data-word]",
        );
        const bodyWords = bodyRef.current?.querySelectorAll<HTMLSpanElement>(
          "[data-body-word]",
        );
        const cta = bodyRef.current?.querySelector<HTMLAnchorElement>("a");
        const statEls = statsRef.current?.querySelectorAll<HTMLDivElement>(
          "[data-stat]",
        );

        // Lock starting states immediately so nothing flashes before the pin.
        gsap.set(darkOverlayRef.current, { opacity: 1 });
        if (words?.length) gsap.set(words, { opacity: 0.15 });
        if (bodyWords?.length) gsap.set(bodyWords, { opacity: 0.15 });
        if (cta) gsap.set(cta, { opacity: 0, y: 16 });
        if (statEls?.length) gsap.set(statEls, { opacity: 0, y: 40 });

        // Dark → light dissolve, scrubbed across the full entry so the
        // overlay glides from 1 → 0 over the same scroll the section
        // climbs the viewport. Wide range (`top bottom` → `top top`) +
        // sine ease gives a continuous, smooth gradient feel — no sudden
        // last-mile snap, no early light, no in-pin delay. By the time
        // the section reaches `top top` (pin engage) the overlay is fully
        // clear and the philosophy reveals start.
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

        // Pin holds the section for 360vh = 160vh reveals + 100vh hold (fully
        // revealed, nothing moving) + 100vh for the next section to slide up
        // over a still-stationary IntroStatement.
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=360%",
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        });

        // Reveal timeline scrubs across only the first 160vh of the pin, so
        // headline / body / CTA / stats are all fully revealed by the time
        // the slide-over window begins.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=160%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // 0.00 – 0.22 : headline brightens word-by-word.
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

        // 0.28 – 0.55 : description brightens word-by-word (same as headline).
        if (bodyWords?.length) {
          tl.to(
            bodyWords,
            {
              opacity: 1,
              ease: "none",
              stagger: { each: 0.007, from: "start" },
              duration: 0.04,
            },
            0.28,
          );
        }

        // 0.55 – 0.60 : CTA slides in.
        if (cta) {
          tl.to(
            cta,
            {
              opacity: 1,
              y: 0,
              ease: "none",
              duration: 0.05,
            },
            0.55,
          );
        }

        // 0.60 – 1.00 : stats reveal one-by-one. Widened stagger (0.11)
        // + shorter per-stat duration (0.08) leaves a small gap between
        // each reveal so the sequence is visibly one-at-a-time rather
        // than an almost-simultaneous fade. `power2.out` gives each stat
        // a soft landing so the slide-in reads on scroll.
        if (statEls?.length) {
          tl.to(
            statEls,
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              stagger: { each: 0.11, from: "start" },
              duration: 0.08,
            },
            0.6,
          );
        }
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative z-10 overflow-hidden min-h-screen"
      style={{ background: "#0D7A95" }}
    >
      {/* Dark overlay that fades from 1 → 0 as the section's top edge
          scrolls from the viewport bottom to the viewport top. Pinned on
          top of content (z-50) so the whole section reads as dark during
          entry, then dissolves to reveal the philosophy section. */}
      <div
        ref={darkOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50 bg-[#06121f]"
      />
      {/* Inline SectionShell equivalent — kept as a plain <div> so we
          don't nest a second <section data-nav-theme> inside the outer
          one (that collision caused the navbar to read the inner
          SectionShell's default "light" instead of this section's "dark").
          data-nav-theme is redundantly set here as a safeguard. */}
      <div
        data-nav-theme="dark"
        className="relative z-20 pt-8 sm:pt-12 pb-16 sm:pb-24 px-6 sm:px-10 wide:px-16"
      >
        <div className="mx-auto max-w-[1320px] wide:max-w-[1560px]">
          {/* ---------- Centered philosophy text ---------- */}
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-white/85">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-white/85"
                />
                Our philosophy
              </span>
            </div>
            <h2
              ref={headlineRef}
              className="serif mt-8 text-[clamp(32px,4vw,68px)] leading-[1.05] whitespace-nowrap uppercase tracking-[0.02em] text-white"
            >
              <span data-word className="inline-block">Sourcing</span>{" "}
              <span data-word className="inline-block">that</span>{" "}
              <span data-word className="inline-block serif-italic text-white">sails</span>{" "}
              <span data-word className="inline-block">on</span>{" "}
              <span data-word className="inline-block">time.</span>
            </h2>

            <div
              ref={bodyRef}
              className="mt-10 sm:mt-12 flex flex-col items-center gap-8"
            >
              <p className="text-[16px] sm:text-[17px] text-white/80 max-w-2xl leading-relaxed">
                {bodySegments.flatMap((seg, segI) =>
                  seg.text.split(" ").map((w, wI) => (
                    <Fragment key={`${segI}-${wI}`}>
                      <span
                        data-body-word
                        className={`inline-block${seg.italic ? " serif-italic text-white font-semibold" : ""}`}
                      >
                        {w}
                      </span>{" "}
                    </Fragment>
                  )),
                )}
              </p>
              <CTAButton href="/about" variant="ivory">Read more</CTAButton>
            </div>
          </div>

          {/* ---------- Frosted-glass stats card ----------
              Semi-transparent white over the teal section with backdrop
              blur so the underlying color reads through as a soft wash.
              Text switches to white/light tokens for contrast. */}
          <div
            ref={statsRef}
            className="relative mt-16 sm:mt-20 wide:mt-24 overflow-hidden rounded-3xl border border-white/25"
            style={{
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(24px) saturate(140%)",
              WebkitBackdropFilter: "blur(24px) saturate(140%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.08), 0 30px 60px -30px rgba(0,0,0,0.45)",
            }}
          >
            <div className="relative p-6 sm:p-10 wide:p-14">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
                {/* Left — eyebrow + card heading */}
                <div className="lg:w-[36%] lg:shrink-0">
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] uppercase text-white/85">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-white/85"
                    />
                    By the numbers
                  </span>
                  <h3 className="serif mt-4 text-[clamp(24px,2.4vw,36px)] leading-[1.1] tracking-[0.01em] uppercase text-white max-w-xs">
                    A desk measured in detail.
                  </h3>
                </div>

                {/* Right — stats laid out horizontally with uniform gap
                    between cells. No dividers. */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-x-8 sm:gap-x-10 wide:gap-x-14 gap-y-8">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      data-stat
                      className="relative flex flex-col gap-2 sm:gap-3 wide:gap-4"
                    >
                      {/* Big number — single unified form so the reader
                          lands on the whole value at once. `tabular-nums`
                          locks column widths across figures. */}
                      <span className="serif tabular-nums text-[clamp(30px,3vw,52px)] wide:text-[60px] leading-[0.95] tracking-[-0.02em] text-white">
                        {s.value}
                      </span>

                      <span className="text-[10px] sm:text-[11px] wide:text-[12px] font-semibold tracking-[0.22em] uppercase text-white/70">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
